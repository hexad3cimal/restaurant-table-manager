package config

import (
	"io"
	"io/ioutil"
	"os"

	runtime "github.com/banzaicloud/logrus-runtime-formatter"
	"github.com/sirupsen/logrus"
)

var Log logrus.Logger

type WriterHook struct {
	Writer    io.Writer
	LogLevels []logrus.Level
}

func (hook *WriterHook) Fire(entry *logrus.Entry) error {
	line, err := entry.String()
	if err != nil {
		return err
	}
	_, err = hook.Writer.Write([]byte(line))
	return err
}

func (hook *WriterHook) Levels() []logrus.Level {
	return hook.LogLevels
}

func InitLogger() *logrus.Logger {

	Log := logrus.New()
	formatter := runtime.Formatter{ChildFormatter: &logrus.JSONFormatter{}}
	formatter.Line = true
	Log.SetFormatter(&formatter)
	Log.SetOutput(io.MultiWriter(ioutil.Discard, os.Stdout))
	Log.AddHook(&WriterHook{
		Writer: os.Stdout,
		LogLevels: []logrus.Level{
			logrus.InfoLevel,
			logrus.DebugLevel,
		},
	})
	// file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	// if err == nil {
	// 	Log.AddHook(&WriterHook{
	// 		Writer: file,
	// 		LogLevels: []logrus.Level{
	// 			logrus.PanicLevel,
	// 			logrus.FatalLevel,
	// 			logrus.ErrorLevel,
	// 			logrus.WarnLevel,
	// 		},
	// 	})
	// } else {
	// 	Log.Info("Failed to log to file, using default stderr")
	// }

	return Log

}
