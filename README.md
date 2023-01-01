# Spam Filter

## 실행방법
1. npm install -s
2. isSpam 함수 내 사용자 입력값 삽입
3. 로컬 서버 실행
4. http://localhost:3000 메인 페이지에서 isSpam 응답값 표시

## 스팸 조건
1. 스팸 링크가 있을 때
2. 리다이렉트 링크가 스팸 링크일 때
3. a 태그 내 스팸 링크가 있을 때

## 구현 방안
1. 사용자가 입력한 텍스트에서 URL 검색
2. 리다이렉션 응답이 있을 시 키 값을 도메인으로 하고 리다이렉션 횟수를 프로퍼티로 가지는 check 객체 생성
```javascript
{
    domain1: redirectionCount1;
    domain2: redirectionCount2;
    ...
}
```
3. 사용자가 입력한 스팸 도메인과 리다이렉션 횟수를 check 객체와 비교

## 최종 상태
- 리다이렉션의 최종 응답에 대한 도메인과 a 태그의 링크를 구한 뒤 리다이렉션 횟수와 비교 후 스팸 확인 가능
- 리다이렉션 중간 응답에 대한 도메인, a 태그의 링크 추출 실패 (check 객체에 삽입 불가)

## 추후 구현 방안
- axios 라이브러리나 다른 라이브러리를 사용하여 리다이렉션에서 응답받은 도메인과 데이터 추출하는 방법 조사
- 도메인과 데이터 내 링크를 check 객체에 추가
- 사용자가 입력한 스팸 도메인 중 check 객체 내 도메인과 리다이렉션 횟수가 일치하는 게 있으면 TRUE 반환

## 12.31 변경사항
- redirect-chain 라이브러리 사용 (리다이렉션 URL 및 도메인 목록 추출 가능)
- 리다이렉션 횟수와 도메인에 따라 비교 가능