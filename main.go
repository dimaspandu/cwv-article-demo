package main

import (
	"log"
	"net/http"
)

func main() {
	// Create logging middleware
	loggingMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("%s %s", r.Method, r.URL.Path)
			next.ServeHTTP(w, r)
		})
	}

	// Serve all static files from the ./heavy/static directory
	fs := http.FileServer(http.Dir("./heavy/static"))
	http.Handle("/", loggingMiddleware(fs))

	// Start the server on port 8080
	log.Println("Starting server on :8080")
	log.Println("Serving files from ./heavy/static directory")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
