package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
)

type Encryption struct {
	key string
}

// hashKey hashes the key using SHA-256 to ensure it is 32 bytes long
func (*Encryption) HashKey(key string) []byte {
	hash := sha256.Sum256([]byte(key))
	return hash[:]
}

// encrypt encrypts the plaintext using AES-GCM with the given key
func (e *Encryption) Encrypt(plaintext string) (string, error) {
	block, err := aes.NewCipher(e.HashKey(e.key))
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// decrypt decrypts the ciphertext using AES-GCM with the given key
func (e *Encryption) Decrypt(ciphertext string) (string, error) {
	decodedCiphertext, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(e.HashKey(e.key))
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	if len(decodedCiphertext) < nonceSize {
		return "", fmt.Errorf("ciphertext too short")
	}

	nonce, ciphertextBytes := decodedCiphertext[:nonceSize], decodedCiphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, ciphertextBytes, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

func NewEncryption(key string) *Encryption {
	return &Encryption{key: key}
}
