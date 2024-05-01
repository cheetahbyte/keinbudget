package tests

import (
	"bytes"
	"encoding/json"
	"io"
)

func convertFiberMapToBytesReader(data interface{}) (io.Reader, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	reader := bytes.NewReader(jsonData)

	return reader, nil
}
