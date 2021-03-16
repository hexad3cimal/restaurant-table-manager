package helpers

import (
	"crypto/rand"
	"fmt"
	"io/ioutil"
	"strings"
	"unicode"
)

func GetString() (code string) {
	byteObject := make([]byte, 5)
	if _, err := rand.Read(byteObject); err != nil {
		panic(err)
	}
	return fmt.Sprintf("%X", byteObject)
}

var zoneDirs = []string{
	"/usr/share/zoneinfo/",
}

var zoneDir string

func GetTimeZones() []string {
	var zones []string
	var zoneDirs = []string{
		// Update path according to your OS
		"/usr/share/zoneinfo/",
		"/usr/share/lib/zoneinfo/",
		"/usr/lib/locale/TZ/",
	}

	for _, zd := range zoneDirs {
		zones = walkTzDir(zd, zones)

		for idx, zone := range zones {
			zones[idx] = strings.ReplaceAll(zone, zd+"/", "")
		}
	}

	return zones
}

func walkTzDir(path string, zones []string) []string {
	fileInfos, err := ioutil.ReadDir(path)
	if err != nil {
		return zones
	}

	isAlpha := func(s string) bool {
		for _, r := range s {
			if !unicode.IsLetter(r) {
				return false
			}
		}
		return true
	}

	for _, info := range fileInfos {
		if info.Name() != strings.ToUpper(info.Name()[:1])+info.Name()[1:] {
			continue
		}

		if !isAlpha(info.Name()[:1]) {
			continue
		}

		newPath := path + "/" + info.Name()

		if info.IsDir() {
			zones = walkTzDir(newPath, zones)
		} else {
			zones = append(zones, newPath)
		}
	}

	return zones
}
