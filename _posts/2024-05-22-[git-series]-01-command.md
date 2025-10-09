---
layout: post
categories: [GIT]
---
from [Dictionary - Command](https://github.com/newkayak12/Dictionary/blob/master/git/01.command.md)



# log
git log --all --oneline --graph : 그래프 확인


# Remote

|                 command                 |        description         |
|:---------------------------------------:|:--------------------------:|
|              git remote -v              | 워킹 트리에 등록돼 있는 원격 저장소 목록 노출 |
| git remote add [remoteName] [remoteUrl] |    원격 저장소를 지정한 이름으로 등록     |
| git remote rename [prevName] [newName]  |  원격 저장소의 이름을 새로운 이름으로 변경   |
|     git remote remove [remoteName]      |       지정한 원격저장소를 삭제        |


# fetch/ pull/ push

|               command                |                         description                          |
|:------------------------------------:|:------------------------------------------------------------:|
| git fetch [remoteName] [branchName]  | 원격 저장소의 커밋과 브랜치, 태그들의 로컬 저장소를 가져온다.<br/> 워킹 트리의 내용이 변하지 않는다. |
|  git pull [remoteName] [branchName]  |                        fetch + merge                         |
| git push [-u remoteName, branchName] |                  해당 브랜치의 커밋을 원격 저장소로 업로드한다.                  |
|     git push [remoteName] --all      |           로컬 저장소의 모든 브랜치와 커밋들을 한꺼번에 원격저장소로 업로드한다.            |
|     git push [remoteName] --tags     |               로컬 저장소의 모든 태그들을 원격 저장소로 업로드한다.                 |


# clean working tree

|                command                |                        description                        |
|:-------------------------------------:|:---------------------------------------------------------:|
| git clean  -f -d [file or folderName] | untracked 상태 파일을 삭제한다. 파일 또는 경로 명시하지 않으면 모든 untracked를 정리 |


# reset
|           command            |                             description                             |
|:----------------------------:|:-------------------------------------------------------------------:|
| git reset --hard [checksum]  |         hard reset이라고 부른다. 해당 커밋으로 돌리고 싶을 때 사용, 워킹 트리도 초기화          |
| git reset --mixed [checksum] |               옵션이 없으면 mixed가 기본, 워킹 트리는 남고 스테이지만 초기화                |
| git reset --soft [checksum]  | soft reset이라고 부르고 HEAD만 이동한다.  커밋은 돌아가지만 스테이지와 워킹 트리의 내용은 변경되지 않는다. |


|      구분       | soft | mixed(기본) | hard |
|:-------------:|:----:|:---------:|:----:|
| 현재 브랜치 (HEAD) | 초기화  |    초기화    | 초기화  |
|     스테이지      | 남아있음 |    초기화    | 초기화  |
|   워킹트리 변경사항   | 남아있음 |   남아있음    | 초기화  |


# reflog

reflog는 로컬 저장소의 커밋 또는 브랜치의 변경 사항을 기록해 놓은 로그를 의미한다.

|           command            |              description               |
|:----------------------------:|:--------------------------------------:|
|git reflog [-n 숫자]| relog를 보여주는 명령 -n 숫자로 갯수를 제한해서 볼 수 있다. | 


# amend
이건 커밋을 고칠 때는 --amend를 사용하면 된다. 이를 사용하는 경우는

 - HEAD가 가리키는 커밋, 즉 현재 커밋을 수정하고 싶을 때
 - 커밋 메시지를 바꾸고자 할 때
 - 이전 커밋의 파일 내용을 수정하고 싶을 때
 - 이전 커밋에 중요 파일을 추가하지 않은 경우

# diff

변경 사항을 비교할 때 사용한다.

|     command      |                                           description                                            |
|:----------------:|:------------------------------------------------------------------------------------------------:|
| git diff [a] [b] | a를 토대로 b에 추가된 차이를 보여준다. 옵션을 생략하면 <br/>아직 스테이지에 추가되지 않은 변경 사항을 보여주는데, 신규 파일(untracked)는 보여주지 않는다. | 


# git diff --check
공백 문자를 체크하는데 유용하게 사용할 수 있는 명령어다.

# -X
merge나 rebase에 -X [ours|theirs]를 사용하면 어떤 것을 기준으로 작업할지 정할 수 있다.

# rebase -i[--interactive]

| command                           | description                                                                                                                                                                                                                                                                                              |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| git rebase -i <수정 하려는 커밋들의 부모 커밋> | HEAD와 지정한 커밋 사이의 커밋들의 히스토리를 수정한다. 옵션으로 지정한 커밋은 수정에서 제외되고 후손들만 편집이 가능하다.<br/> <br/> p( pick ) : 해당 커밋을 그대로 변경 없이 사용 <br/> r( reword ) : 해당 커밋을 사용. 단 커밋 메시지를 편집 <br/> e( edit ) : 해당 커밋을 사용 단 커밋을 수정할 수 있도록 된다. <br/> s( squash ) : 커밋을 사용. 단 내용은 부모 커밋에 합쳐지고 커밋은 사라진 것처럼 보임 <br/> d ( drop ) : 해당 커밋을 제거 | 


# cherry-pick
git cherry-pick은 다른 브랜치에 있는 특정 커밋을 골라 현재 브랜치에 합칠 때 사용한다.


# stash
작업 폴더의 변경 내용을 넣어두는 명령어 `git stash`를 사용하면 stash 스택(.git/refs/stash)에 저장한다.
stash는 변경사항을 커밋하기도, 삭제하기도 애매한 상황에서 사용한다. 

| command                     | description                                                                           |
|:----------------------------|:--------------------------------------------------------------------------------------|
| git stash [-u]              | 변경 사항을 스택에 저장하고 현재 작업 폴더를 clean 상태로 만든다. -u를 사용하면 untracked도 저장한다.                    |
| git stash list              | stash 리스트를 확인하다.                                                                      |
| git stash pop [stash 객체]    | stash 스택에 있는 변경사항을 현재 작업 폴더에 반영한다. 반영된 stash는 제거한다. 옵션을 붙이면 해당 객체를 아니면 마지막의 객체를 꺼내온다. |
| git stash apply [stash 객체]  | pop과 유사하지만 스택에서 제거하지는 않는다.                                                            |
| git stash drop [stash 객체]   | 지정한 stash를 제거한다.                                                                      |
| git stash clear             | 스택의 모든 stash를 삭제                                                                      |
| git stash branch [stash 객체] | 마지막 체크아웃된 커밋에 stash 내용 반영해서 새로운 브랜치 생성 (테스트 할 떄 유용)                                   |

> 다른 브랜치에서 작업했을 때?
> git status -u
> git checkout -b temporaryBranch
> git stash pop
>

# add

| command                    | description                                                                                                                                                   |
|:---------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| git add --patch [fileName] | 변경 사항의 일부만 커밋하고 싶을 때 사용할 수 있다.<br/><br/> ? : 도움말 <br/>y: 현재 변경사항(hunk)를 스테이징 <br/>n: 현재 변경 사항을 스테이징 하지 않는다. <br/>e: 직접 스테이지에 올릴 내용을 편집<br/> q: 변경 사항을 무시하고 종료 |


##  untracked 파일 일부 변경 사항 커밋
| command                | description                                      |
|:-----------------------|:-------------------------------------------------|
| git add --N [fileName] | untracked 상태의 파일을 스테이지에 올린다. 단 내용은 올리지 않고 상태만 변경 |


## add --interactive [-i]
add에 인터렉티브한 작업을 선택할 수 있다.

# git blame으로 히스토리 조회

| command                             | description                                                     |
|:------------------------------------|:----------------------------------------------------------------|
| git blame [-L <시작줄, 끝줄>] <fileName> | 해당 파일을 변경했던 커밋 히스토리를 보여준다. -L로 시작 - 끝 줄을 지정하고 특정 범위만 조회할 수도 있다. |


# filter-branch로 히스토리 파일 삭제
| command                                                 | description                 |
|:--------------------------------------------------------|:----------------------------|
| git filter-branch --tree-filter 'rm -f <fileName>' HEAD | HEAD로부터 모든 히스토리에 지정한 파일을 삭제 |


# git alias
단축 명령어 생성

git config --global alias.st status 
-> git st (==git status)

git config --global alias.graph " log --oneline --graph --all "
-> git graph -n5


# global ignore
1. ignore 생성
2. git conifg --global core.excludesfiles ~/path
3. 

# git reflog
checkout, commit들에 대한 내역을 볼 수 있다.
만일 local에 commit만 하고 reset --hard를 했다면 reflog로 찾아서 git reset --hard [revisionNumber]로 되돌려 놓을 수 있다.
