package main

import (
	"bufio"
	"bytes"
	"compress/gzip"
	"net/http"
	"os"
	"strings"
)

func minifyContent(content []byte, contentType string) []byte {
	// Simple minification: remove extra whitespace
	// For production, use a proper minifier library
	switch contentType {
	case "text/css", "application/javascript":
		// Remove extra spaces and newlines
		minified := bytes.ReplaceAll(content, []byte("  "), []byte(" "))
		minified = bytes.ReplaceAll(minified, []byte("\n"), []byte(""))
		minified = bytes.ReplaceAll(minified, []byte("\t"), []byte(""))
		return minified
	default:
		return content
	}
}

func streamHTML(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	if _, ok := w.(http.Flusher); !ok {
		http.ServeFile(w, r, "./static/index.html")
		return
	}

	file, err := os.Open("./static/index.html")
	if err != nil {
		http.Error(w, "File not found", 404)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	writer := bufio.NewWriter(w)

	// Stream head first for faster FCP
	for scanner.Scan() {
		line := scanner.Text() + "\n"
		writer.WriteString(line)
		writer.Flush()

		// Flush after </head> to send critical resources early
		if strings.Contains(line, "</head>") {
			break
		}
	}

	// Continue with the rest
	for scanner.Scan() {
		writer.WriteString(scanner.Text() + "\n")
	}

	writer.Flush()
}

type gzipResponseWriter struct {
	http.ResponseWriter
	gz *gzip.Writer
}

func (grw gzipResponseWriter) Write(data []byte) (int, error) {
	return grw.gz.Write(data)
}

func gzipMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.Contains(r.Header.Get("Accept-Encoding"), "gzip") {
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("Content-Encoding", "gzip")
		w.Header().Set("Vary", "Accept-Encoding")

		gz := gzip.NewWriter(w)
		defer gz.Close()

		grw := gzipResponseWriter{ResponseWriter: w, gz: gz}
		next.ServeHTTP(grw, r)
	})
}

func minifyHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Create a response recorder to capture the response
		recorder := &responseRecorder{ResponseWriter: w, body: &bytes.Buffer{}}

		h.ServeHTTP(recorder, r)

		// Determine content type and minify if applicable
		contentType := w.Header().Get("Content-Type")
		minified := minifyContent(recorder.body.Bytes(), contentType)

		// Set content length for minified content
		w.Header().Set("Content-Length", string(rune(len(minified))))

		// Write the minified content
		w.Write(minified)
	})
}

type responseRecorder struct {
	http.ResponseWriter
	body *bytes.Buffer
}

func (rr *responseRecorder) Write(data []byte) (int, error) {
	return rr.body.Write(data)
}

func main() {
	mux := http.NewServeMux()
	fileServer := http.FileServer(http.Dir("./static"))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			// Apply minification to CSS and JS files
			if strings.HasSuffix(r.URL.Path, ".css") || strings.HasSuffix(r.URL.Path, ".js") {
				minifyHandler(fileServer).ServeHTTP(w, r)
			} else {
				fileServer.ServeHTTP(w, r)
			}
			return
		}

		// Stream HTML for faster FCP
		streamHTML(w, r)
	})

	http.ListenAndServe(":5176", gzipMiddleware(mux))
}
