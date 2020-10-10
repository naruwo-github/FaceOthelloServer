# FaceOthelloServer
This project is a server of the App "FaceOthello".

# サーバーの仕様
## API
### GET
| Endpoint | Reqest body | Response | Description |
| --- | --- | --- | --- |
| /room/create | None | room_id | ルームの作成 |  
| /enter/:id | None | `{ player_num: num }`| ルーム入室<br>レスポンスとして何番目に入室したかが返る |
| /room/exit | None | `room_id` | ルーム退出<br>レスポンスとして退出した部屋のIDが返る |

## Socket.io
### Client -> Server
| Event | Body | Description |
| --- | --- | --- |
| put stone | `data` | 自分の行動をサーバー側に送信<br>※サーバーではdataは加工せずそのまま対戦相手に送信する |
| send image | `image` | 画像をサーバーに送信<br>対戦相手が揃ってから送信しないと画像が届かない |
| disconnect | `msg` | 切断されたときに自動で発生するイベント（クライアント側でコードを書く必要はありません）<br>サーバー側でクライアントのルームからの退出処理
### Server -> Client
| Event | Body | Description |
| --- | --- | --- |
| put stone | `data` | 対戦相手の行動を通知 |
| send image | `image` | 対戦相手の画像を受信 |
| enter | `num` | クライアント接続時にそのクライアントの入室した部屋のメンバー全員に今のルームの人数を通知 |
| exit | `"Other player exit the room"` | 対戦相手が退出したことを通知<br>通信障害による退出ならばすぐに'enter'イベントで対戦相手が戻ってくるはず |
