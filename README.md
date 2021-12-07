# CE224 - Embedded System Design
## Overview
This is the final project of the CE224 - Embedded System Design.  
The system has the function of student attendance through student card. After scanning the card, attendance status will be displayed via LCD16x2, and attendance results will be displayed via webserver.
<p align="center">
  <img width="460" height="300" src="https://scontent.xx.fbcdn.net/v/t1.15752-9/s320x320/263279186_170641265246242_8812481336949471079_n.png?_nc_cat=110&ccb=1-5&_nc_sid=aee45a&_nc_ohc=WkogxehIJsoAX-2LyIi&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=ccb09fe6331b17ec34e2acecdda9506a&oe=61D55905">
</p>

## [Attendance](https://github.com/Le-M1nh/attendanceRFID/tree/master/AttendanceNode)
The project included read card, send statuses to LCD, send data to database, OTA, interrupt. 
- read card: ESP8266 reading card via module RC522 (using I2C).
- send statuses to LCD: READY (waiting for card scan), WAIT (the system is processing), INVALID_ID(student ID not available), FAILED (failed attendance), INVALID_CLASS (student not in class), SUCCESS.
- OTA: use available libraries (ElegantOTA.h) to install.
- interrupt: interrupt settings to choose which class to take attendance.

## [Server](https://github.com/Le-M1nh/attendanceRFID/tree/master/Server)
Database: [MongDB](https://www.mongodb.com/)  
System interface

<p align="center">
  <img width="460" height="300" src="https://scontent.xx.fbcdn.net/v/t1.15752-9/p206x206/263544619_954314278509847_4674632640142437778_n.png?_nc_cat=110&ccb=1-5&_nc_sid=aee45a&_nc_ohc=c3ks_Ek4CTEAX-pZVRT&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=31f85938b5b395c11a4741a39735f82f&oe=61D6516B">
</p>

### Team member:
|No.| Full name             |Student ID     |Github|
|:-:|:---------------------:|:---------:|:--------:|
| 1	|[Lê Hoàng Minh](mailto:19520158@gm.uit.edu.vn)| 19520158	|[Le-M1nh](https://github.com/Le-M1nh)|
| 2	|[Phạm Công Huy](mailto:19521631@gm.uit.edu.vn)| 19521631	  |[phamhuy0206](https://github.com/phamhuy0206)|
| 3	|[Trần Quốc Sơn](mailto:19522142@gm.uit.edu.vn)| 19522142	  |[sonce139](https://github.com/sonce139)|
| 4	|[Đào Công Nhật Tân](mailto:195221687@gm.uit.edu.vn)| 19522168	  |[TanItech](https://github.com/TanItech)|
| 5	|[Phạm Thanh Lâm](mailto:19520673@gm.uit.edu.vn)| 19520673	  |[lampt131201](https://github.com/lampt131201)|
