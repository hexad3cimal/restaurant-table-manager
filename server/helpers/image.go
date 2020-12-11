package helpers

import (
	"io"
	"net/http"
	"os"
)

func SaveFile(r *http.Request, folder string) (string, error) {

	file, handler, err := r.FormFile("file")

	if err != nil {
		return "", err
	}
	defer file.Close()

	f, err := os.OpenFile(folder+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		return "", err
	}

	// Copy the file to the destination path
	io.Copy(f, file)

	return handler.Filename, nil
}
