package main

import "net/http"

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.FileServer(http.Dir("./static")).ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, "./static/index.html")
	})

	http.ListenAndServe(":5175", nil)
}
