---
layout: post
title: Effective java
categories: [EFFECTIVE_JAVA]
---



# try-finally 보다는 try-with-resource

```java
import java.io.*;

class Example {
    public void tryFinally() {
        InputStream in = new FileInputStream(new File("/"));
        try {
            OutputStream out = new FileOutputStream(new File("/"));
            
            try {
                byte[] buf = new byte[1024];
                int n;
                while ( (n = in.read(buf)) >= 0 )  out.write(buf, 0, n);
            } finally {
                out.close();
            }
        } finally {
            in.close();
        }
        
        //try-finally 중첩으로 hell이 시작된다.
    }
    
    public void tryWithResource() {
        //AutoCloseable  구현이 전제 조건이다.

        try (
                InputStream in = new FileInputStream(new File("/"));
                OutputStream out = new FileOutputStream(new File("/"));
        ){

            byte[] buf = new byte[1024];
            int n;
            while ( (n = in.read(buf)) >= 0 )  out.write(buf, 0, n);
            
        } catch (Exception e) {

        }
    }

}

```

는 