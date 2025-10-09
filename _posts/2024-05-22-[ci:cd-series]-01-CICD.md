---
layout: post
categories: [CI/CD]
---
from [Dictionary - CI/CD](https://github.com/newkayak12/Dictionary/blob/master/cicd/00.CICD.md)




# CI/CD
## [Junit](https://newkayak12.github.io/java/2024/05/18/java-series-24-Junit.html)

## 기본 개념
### pipeline
일련의 Job으로 구성된 단위이다.

### Job
파이프 라인을 구성하는 최소 작업 단위다.

### Variables
Job에서 사용하거나 다른 곳에 재사용 할 때 지정할 수 있는 환경 변수의 한 유형이다.

### Runner
pipeline을 따라 Job을 실행시키는 주체다. 러너의 종류로는 1. 공유 러너, 2. 그룹 러너, 3. 지정 러너가 있다.

### Artifacts
일련의 단계에서 나온 산출물이다.

### 예시
```yaml
## 파이프라인의 단계
stages:
  - test
  - build
  - packing
  - deploy


## 해당 파이프라인에서 사용할 로컬 변수
variables:
  STAGE_TARGET_PATH: /home/service
  STAGE_NAME: $STAGE_NAME
  STAGE_TARGET_SERVER: $STAGE_TARGET_SERVER


  ##Job
test:
  ## 단계
  stage: test
  ##어떤 이미지를 사용 할 것이며
  image: gradle-8.6.0-jdk17
  ##어떤 상황에서 실행되는가
  when: always
  ##트리거가 되는 브랜치
  only:
    - stage
    - master
  ##태그
  tags:
    - test_work
  before_script:
    - pwd
    - chmod +x gradlew
  script:
    - echo [INFO] TEST PROJECT $CI_PROJECT_NAME
    - ./gradlew test




build: ##Job
  ## 단계
  stage: build
  ##어떤 이미지를 사용 할 것이며
  image: gradle:7.6-jdk11-alpine
  ##어떤 상황에서 실행되는가
  when: on_success 
  ## 선행되어야만 하는 작업
  needs:
    - job: test
  ##트리거가 되는 브랜치
  only:
    - stage
    - master
  ##job에 대한 태그
  tags:
    - build_work
  # 스크립트 이전 실행
  before_script:
    - pwd
    ## 자바HOME을 유동적으로 변경(Gradle -> 2024-05-22-[gradle-series]-Summary.md)
    - cp $JAVA_HOME_11 gradle.properties
    - chmod +x gradlew
    - ./gradlew clean
  #스크립트
  script:
    - echo [INFO] BUILD PROJECT $CI_PROJECT_NAME
    - ./gradlew generateDbJooqSchemaSource"
    - ./gradlew -x generateDbJooqSchemaSource bootjar  --continue"
    - echo [INFO] RENAME FILE
    - cp build/libs/*.jar $CI_PROJECT_NAME.jar
  ## 빌드 결과물을 저장할 아티팩트
  artifacts:
    paths:
      - build/libs/*.jar
    expire_in: 1 days

stage:
  stage: deploy
  needs:
    - job: build
      artifacts: true
  when: on_success
  only:
    - stage
  script:
    - echo [INFO] DEPLOY STAGE_MODE $CI_PROJECT_NAME
    - echo [INFO] move to ${STAGE_TARGET_SERVER}
    - cp build/libs/*.jar $CI_PROJECT_NAME.jar
     ## 파일로 된 전역 변수 가져와서
    - cat $STAGE_TARGET_SERVER_KEY 
    ##권한 하향
    - chmod 400 $STAGE_TARGET_SERVER_KEY
      
      ## 파일 만들고 전송하고 하는 일련의 과정
    - echo ssh -i $STAGE_TARGET_SERVER_KEY ${STAGE_NAME}@${STAGE_TARGET_SERVER} mkdir -p ${STAGE_TARGET_PATH}
    - ssh -i  $STAGE_TARGET_SERVER_KEY ${STAGE_NAME}@${STAGE_TARGET_SERVER} mkdir -p ${STAGE_TARGET_PATH}
    - ssh -i  $STAGE_TARGET_SERVER_KEY ${STAGE_NAME}@${STAGE_TARGET_SERVER} << EOT
    - cd ${STAGE_TARGET_PATH}
    - |
      exist=`ls | grep $CI_PROJECT_NAME.jar | wc -l`
      if [ $exist > 0 ]
        then
          echo create backupFile as $CI_PROJECT_NAME.jar_{CI_COMMIT_TIMESTAMP}
          mv ${STAGE_TARGET_PATH}/$CI_PROJECT_NAME.jar ${STAGE_TARGET_PATH}/$CI_PROJECT_NAME.jar_${CI_COMMIT_TIMESTAMP}
      fi
    - scp -i  $STAGE_TARGET_SERVER_KEY $CI_PROJECT_NAME.jar ${STAGE_NAME}@${STAGE_TARGET_SERVER}:${STAGE_TARGET_PATH}
    - cat $START
    - scp -i  $STAGE_TARGET_SERVER_KEY $START ${STAGE_NAME}@${STAGE_TARGET_SERVER}:${STAGE_TARGET_PATH}/start.sh
    - cat $STAGE_TARGET_SERVER_KEY
    - ssh -i  $STAGE_TARGET_SERVER_KEY ${STAGE_NAME}@${STAGE_TARGET_SERVER} chmod 755 ${STAGE_TARGET_PATH}/start.sh
    - ssh -i  $STAGE_TARGET_SERVER_KEY ${STAGE_NAME}@${STAGE_TARGET_SERVER} << EOT
    - cd ${STAGE_TARGET_PATH}
    - ./start.sh
    - EOT
    - echo Congratulation. All done!

deploy_as_production:
  stage: deploy
  needs:
    - job: build
      artifacts: true
  when: on_success
  only:
    - master
  script:
    - echo [INFO] DEPLOY PRODUCTION_MODE $CI_PROJECT_NAME




```