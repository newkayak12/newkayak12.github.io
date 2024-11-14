# File/Stream

- `FileReader`
- `FileWriter`
- `FileInputStream`
- `FileOutputStream`

## use
- java의 try-catch-resource와 같이 `use`는 lambda를 받으며, 리소스 사용이 끝나면 정리해준다. `java.io.Closeable`에 대해서 호출할 수 있다.

## 생성
- `bufferedReaders()`/`bufferedWriter()`: BufferedReader, BufferedWriter 객체를 만든다.
- `reader()`/`writer()`: FileReader,FileWriter 객체를 만든다.
- `byteInputStream()`: String, ByteArray에 대한 ByteArrayInputStream을 만든다.
- `InputStream`인스턴스를 바탕으로 Reader, BufferedReader, BufferedInputStream을 얻을 수 있다.
- `OutputStream`을 바탕으로 Writer, BufferedWriter, BufferedOutputStream을 얻을 수 있다.

## URL
- `URL.readText()`/`URL.readBytes()`

## FIleSystemUtility
- `deleteRecursively()`를 이용하면 파일이나 디렉토리를 자신에게 포함된 자손들까지 포함해 쉽게 가져올 수 있다.
- `copyTo()`는 자신의 수신 객체를 다른 파일에 복사하고 복사본을 가리키는 파일 객체를 리턴한다.
- `copyRecursively()`: 아래와 충돌 시 같은 옵션이 있다. 
  - SKIP: 파일을 무시하고 복사를 계속 진행한다.
  - TERMINATE: 복사를 중단한다.
- `walk()`: DFS로 순회한다.
  - TOP_DOWN
  - BOTTOM_UP