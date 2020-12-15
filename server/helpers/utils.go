package helpers

import (
	"crypto/rand"
	"fmt"
)

func GetString() (code string) {
	byteObject := make([]byte, 5)
	if _, err := rand.Read(byteObject); err != nil {
		panic(err)
	}
	return fmt.Sprintf("%X", byteObject)
}
