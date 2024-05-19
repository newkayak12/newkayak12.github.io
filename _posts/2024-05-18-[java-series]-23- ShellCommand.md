from [Dictionary - shellCommand](https://github.com/newkayak12/Dictionary/blob/master/java/23.%20ShellCommand.md)

당시 OOM이 나서 여러 옵션을 건들였었는데 이에 대해서 찾아보고 이를 기록한 문서입니다.

```shell 

#!/bin/bash


projectName='projectName'
pid=`ps -ef | grep $projectName-*.war | grep -v grep | awk '{print $2}'`



/home/jdk-11/bin/jstat -gcutil -h 20 $pid 2000 10000


```
```shell
#!/bin/bash
projectName='projectName'
pid=`ps -ef | grep $projectName-*.war | grep -v grep | awk '{print $2}'`


/home/jdk-11/bin/jhsdb jmap --binaryheap --dumpfile /home/chat/dump.hprof --pid $pid
```

```shell

#!/bin/bash
#

projectName='projectName'
pid=`ps -ef | grep $projectName-*.war | grep -v grep | awk '{print $2}'`

/home/jdk-11/bin/jcmd $pid GC.class_histogram > histogram.log


```

```shell
if [ -z $pid ]
 then
        echo "No server is running."
 else
        kill -9 "$pid"
        echo "Shut down the running server."
fi

/home/jdk-11/bin/java \
-XX:+UseParallelOldGC \
-Xms1024m \
-Xmx4096m \
-XX:+HeapDumpOnOutOfMemoryError \
-XX:HeapDumpPath=/home/chat/dump/heapdump.hprof \
-verbose:gc \
-jar \
-Dspring.profiles.active=prod \
$projectPath/$projectName-*.war \
> $projectPath/out.log  \
2> $projectPath/exception.log &


echo "The server was successfully run."

```
