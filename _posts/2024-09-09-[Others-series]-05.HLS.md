---
layout: post
categories: [OTHERS]
---


# HLS(Http Live Streaming)

가장 널리 사용되는 비디오 스트리밍 프로토콜이다. 이 프로토콜은 동영상을 여러 개의 작은 세그먼트로 부할하고, 
이러한 세그먼트를 HTTP 기반의 웹 서버를 통해서 전송한다. 클라이언트는 이 세그먼트를 다운로드하여 연속적으로 재생함으로써
스트리밍 영상을 시청할 수 있다.


## 특징

1. 적응형 스트리밍(AdaptiveStreaming) : HLS는 네트워크 상태에 따라 동적으로 비트레이트를 변경하여 최적의 영상 품질을 제공한다. 서버는 다양한 해상도와 비트레이트의 동영상 세그먼트를 저장하고, 클라이언트는 현재의 네트워크 상태에 적합한 세그먼트를 선택하여 재생한다.
2. 라이브 스트리밍 및 VOD 지원 : HLS는 라이브 스트리밍과 비디온 온-디맨드 모두를 지원한다. 라이브 스트림ㅇ의 경우, 실시간으로 생성되는 세그먼트를 클라이언트에 전송하여, VOD의 경우 이미 저장된 세그먼트를 전송한다.
3. 널리 지원되는 형식 : HLS는 iOS, Android, OS X, Windows 등 다양한 플랫폼에서 지원된다. 또한 대부분의 웹 브라우저에서도 지원되며, HTML5 video 태그를 사용해서 플레이할 수 있다.
4. DRM(Digital Rights Management)지원 : HLS는 FairPlay Streaming, Widevine, PlayReady 등 다양한 DRM 기술을 통해 콘텐츠의 저장권 보호를 지원한다.
                        