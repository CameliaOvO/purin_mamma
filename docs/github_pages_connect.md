# GitHub Pages 연결 방법

이 저장소는 정적 웹사이트라서 GitHub Pages에 연결하면 바로 볼 수 있습니다. 현재 저장소에는 GitHub Actions로 Pages에 자동 배포하는 워크플로가 포함되어 있습니다.

## 먼저 확인할 것

GitHub Pages 주소는 저장소 종류에 따라 달라집니다.

| 저장소 종류 | 저장소 이름 예시 | 접속 주소 |
| --- | --- | --- |
| 사용자 사이트 | `<username>.github.io` | `https://<username>.github.io/` |
| 프로젝트 사이트 | `purin_mamma` | `https://<username>.github.io/purin_mamma/` |

이 프로젝트 저장소 이름이 `purin_mamma`라면 보통 `https://<username>.github.io/purin_mamma/` 주소로 열립니다. `https://<username>.github.io/`에 바로 보이게 하려면 저장소 이름이 반드시 `<username>.github.io` 형태여야 합니다.

## 자동 배포로 연결하기

1. GitHub에서 이 저장소를 엽니다.
2. **Settings**로 이동합니다.
3. 왼쪽 메뉴에서 **Pages**를 선택합니다.
4. **Build and deployment**의 **Source**를 `GitHub Actions`로 바꿉니다.
5. 변경사항을 `work`, `main`, 또는 `master` 브랜치에 push합니다.
6. 저장소의 **Actions** 탭에서 `Deploy static site to GitHub Pages` 워크플로가 성공했는지 확인합니다.
7. 성공한 워크플로 화면 또는 **Settings > Pages**에 표시되는 배포 주소를 엽니다.

## 브랜치에서 직접 배포하기

GitHub Actions를 쓰지 않고 브랜치에서 바로 배포하려면 아래처럼 설정합니다.

1. **Settings > Pages**로 이동합니다.
2. **Build and deployment**의 **Source**를 `Deploy from a branch`로 선택합니다.
3. Branch는 배포할 브랜치를 선택합니다.
4. Folder는 `/ (root)`를 선택합니다.
5. **Save**를 누릅니다.
6. 몇 분 뒤 표시되는 Pages 주소를 엽니다.

## 안 보일 때 체크리스트

- **주소가 맞는지 확인**: 프로젝트 사이트는 보통 `/<repository>/` 경로가 붙습니다.
- **브랜치가 맞는지 확인**: Pages가 바라보는 브랜치에 `index.html`이 있어야 합니다.
- **배포가 끝났는지 확인**: Actions 탭 또는 Settings > Pages에서 성공 상태를 확인합니다.
- **저장소 공개 여부 확인**: 무료 계정에서 private 저장소 Pages는 계정/플랜에 따라 제한될 수 있습니다.
- **몇 분 기다린 뒤 새로고침**: 첫 배포나 설정 변경은 반영에 시간이 걸릴 수 있습니다.

## 내 github.io 루트에 바로 보이게 하고 싶다면

`https://<username>.github.io/`에 바로 보이게 하려면 두 가지 방법 중 하나를 선택합니다.

1. 이 저장소 이름을 `<username>.github.io`로 바꿉니다.
2. `<username>.github.io` 저장소를 따로 만들고, 이 프로젝트의 `index.html`, `styles.css`, `app.js`, `docs/`를 그 저장소 루트로 옮깁니다.

여러 프로젝트를 운영할 계획이면 이 저장소는 그대로 두고 `https://<username>.github.io/purin_mamma/`로 접속하는 방식이 더 관리하기 쉽습니다.
