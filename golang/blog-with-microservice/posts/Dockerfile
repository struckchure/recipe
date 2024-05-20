FROM golang:1.22.0-alpine

WORKDIR /code/

COPY . .

RUN go mod tidy
RUN go build -o main

FROM scratch

COPY --from=0 /code/main /main

CMD [ "/main" ]
