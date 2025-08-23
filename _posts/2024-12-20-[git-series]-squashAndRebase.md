---
layout: post
categories: [GIT]
---


# Squash And Rebase


## Merge

{% raw %}
<div class="mermaid">
gitGraph
    commit id: "a commit"
    commit id: "b commit"
    branch develop-1
    commit id: "develop-1 a commit"
    checkout main
    branch develop-2
    commit id: "develop-2 a commit"
    commit id: "develop-2 b commit"
    checkout main
    merge develop-2 id: "merge develop-2 into main"
    checkout main
    merge develop-1  id: "merge develop-1 into main"
</div>
{% endraw %}

- 위와 같이 하나의 브랜치와 다른 브랜치의 변경 이력 전체를 합치는 것

## Squash Merge

{% raw %}
<div class="mermaid">
gitGraph
    commit id: "a commit"
    commit id: "b commit"
    branch develop-1
    commit id: "develop-1 a commit"
    checkout main
    branch develop-2
    commit id: "develop-2 a commit"
    commit id: "develop-2 b commit"
    commit id: "develop-2 c commit"
    commit id: "develop-2 squash (a + b + c) commit"
    checkout main
    merge develop-2 id: "merge develop-2 into main"
    checkout main
    merge develop-1  id: "merge develop-1 into main"
</div>
{% endraw %}


- 위와 같이 하나의 브랜치와 다른 브랜치의 변경 이력 전체를 합치는 것
- `develop-2`의 commit 내역을 합쳐서 새로운 commit을 만들고 이를 merge 대상에 붓는 것을 의미한다.
- commit history를 합쳐서 깔끔하게 만들 수 있다.
- `git merge --squash develop-2`


## Rebase Merge
{% raw %}
<div class="mermaid">
gitGraph
    commit id: "a commit"
    commit id: "b commit"
    branch develop-1
    commit id: "develop-1 a commit"
    checkout main
    branch develop-2
    commit id: "develop-2 a commit x"
    commit id: "develop-2 b commit x"
    commit id: "develop-2 c commit x"
    checkout main
    merge develop-1  id: "merge develop-1 into main"
    checkout main
    commit id: "develop-2 a commit rebased"
    commit id: "develop-2 b commit rebased"
    commit id: "develop-2 cx commit rebased"
</div>
{% endraw %}


- commit 들이 합쳐지지 않고 main에 추가된다.
- commit은 모두 하나의 parent를 가진다.
- `git rebase main` -> `git checkout main` -> `git merge develop-2`
- base를 새롭게 설정한다는 의미다.
- `-i`로 `--interactive`를 주면 rebase를 유저가 상호작용할 수 있게 해준다.
- 커밋 메시지를 수정하거나 몇몇 커밋을 제외하거나 순서를 바꿀 수도 있다.
- `git rebase -i <Commit>` 은 Commit ~ HEAD 까지 커밋을 선택한다.
    - pick: 커밋 수정 없이 그대로 사용
    - reword: 커밋 메시지 수정
    - edit: 커밋 메시지, 작업 내용도 수정
    - squash&fix: 해당 커밋을 이전 커밋과 합친다. 