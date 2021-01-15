package helpers

import (
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

func SaveFile(r *http.Request, folder string) (string, error) {

	file, handler, err := r.FormFile("file")

	if err != nil {
		return "", err
	}
	defer file.Close()

	fileName := strconv.FormatInt(time.Now().Unix(), 10) + handler.Filename
	if _, err := os.Stat(folder); os.IsNotExist(err) {
		os.Mkdir(folder, 0700)
	}
	createdFile, err := os.OpenFile(folder+fileName, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		return "", err
	}

	io.Copy(createdFile, file)

	return fileName, nil
}
