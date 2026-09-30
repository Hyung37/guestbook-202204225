# Guestbook

방문자가 이름과 메시지를 남기고, 글을 쓸 때 정한 비밀번호로 본인 글만 고치거나 지우는 미니 방명록.

## Language

**Entry (글)**:
방문자가 남긴 이름, 메시지, 작성 시각의 묶음. 방명록에 쌓이는 단위.
_Avoid_: post, comment, 댓글, 게시물

**Author (글쓴이)**:
Entry를 남긴 방문자. 계정이 없으며, Entry 작성 시 정한 비밀번호를 아는 사람이 곧 글쓴이로 인정된다.
_Avoid_: user, member, 회원

**Entry Password (글 비밀번호)**:
글쓴이가 Entry를 작성할 때 함께 입력하는 비밀번호. 해당 Entry의 수정·삭제 권한을 확인하는 유일한 수단이며, 복구할 수 없다.
_Avoid_: account password, 로그인 비밀번호

**Message (메시지)**:
Entry의 본문. 수정할 수 있는 유일한 항목.
_Avoid_: content, body, 내용

**Created At (작성 시각)**:
Entry가 처음 남겨진 시각. 수정해도 바뀌지 않는다.
_Avoid_: posted at, date

**Edited At (수정 시각)**:
Entry의 Message가 마지막으로 수정된 시각. 수정된 적이 없으면 없다.
_Avoid_: modified, updated

**Password Mismatch (비밀번호 불일치)**:
글쓴이가 입력한 비밀번호가 Entry Password와 맞지 않아 수정이나 삭제가 거부된 상태. 글쓴이에게 그 사실을 즉시 알린다.
_Avoid_: auth failure, unauthorized

**Developer Credit (개발자 표시)**:
화면에 항상 보이는 개발자의 이름과 학번.
