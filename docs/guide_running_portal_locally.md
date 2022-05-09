# Guide to running portal locally with a custom portal config

This guide shows you how to test a portal config (aka `gitops.json` file) locally, so that you don't have to wait until the new `gitops.json` file is uploaded to GitHub and merged to see if your changes will break everything!

Assuming you want to edit the `gitops.json` file for `preprod.healdata.org`:

(Before you start make sure that [preprod.healdata.org](http://preprod.healdata.org) is up and running!)

1. Make sure that you have `git` [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), `node.js` and `npm` [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm) all installed.
    1. To test if `npm` and `node` are working: open a terminal window and type `npm -v`. If you see something like `4.2.0` you're good, if you see something like `command not found: npm` and you're sure you installed Node and npm, you may need to restart your terminal for it to work, or you could have a problem with your path: [https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10](https://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8-and-10).
2. Make a folder called `uc-cdis` and open a terminal window to it. [https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/)
3. Download the `cdis-manifest` GitHub repo to the `uc-cdis` folder. In your terminal, which is open to the `uc-cdis` folder, type:

    ```bash
    git clone https://github.com/uc-cdis/cdis-manifest
    ```

    You should see this message after you hit enter:

    ```
    Cloning into 'cdis-manifest'...
    remote: Enumerating objects: 160, done.
    remote: Counting objects: 100% (160/160), done.
    remote: Compressing objects: 100% (118/118), done.
    remote: Total 11019 (delta 86), reused 66 (delta 31), pack-reused 10859
    Receiving objects: 100% (11019/11019), 23.81 MiB | 11.82 MiB/s, done.
    Resolving deltas: 100% (6924/6924), done.
    ```

4.  Download the data-portal github repo to the `uc-cdis` folder.

    ```bash
    git clone https://github.com/uc-cdis/data-portal
    ```

5. Now navigate to the `data-portal` folder (`cd data-portal`) and run `npm install`. This command will probably take a few mins.
    1. There may be some errors that show up — if they look like this: `rc-steps@4.1.3 requires a peer of react@>=16.9.0 but none is installed. You must install peer dependencies yourself.` then that's ok
6. Once the `npm install` command finishes, follow these instructions to run portal locally: [https://github.com/uc-cdis/data-portal#local-development-and-devhtml](https://github.com/uc-cdis/data-portal#local-development-and-devhtml). Here's a tl;dr version:
    1. In the terminal, in the data-portal folder, type `HOSTNAME=preprod.healdata.org NODE_ENV=auto bash ./runWebpack.sh`. This will start the local version of portal, it could take a minute or two to compile. Once you see a message that says: `ℹ ｢wdm｣: Compiled with warnings.`you're good!
        1. :information_source: For Gen3 environments with customized basename, you need to set the `BASENAME` env var as well during this step, for example: `HOSTNAME=preprod.healdata.org NODE_ENV=auto BASENAME=/portal bash ./runWebpack.sh`
    2. Open a browser and go to [https://localhost:9443/bundle.js](https://localhost:9443/bundle.js) and accept the warning about certificates. (May be hidden under a small button saying `advanced`.) If it works, you should see a bunch of code appear. You should only need to do this once every few weeks.
        1. :information_source: If you ran the command in step 1 with customized basename, you need to go to [https://localhost:9443/portal/bundle.js](https://localhost:9443/portal/bundle.js)
    3. Go to [https://preprod.healdata.org/dev.html](https://preprod.healdata.org/dev.html). You should see the good old HEAL preprod page — but this one is coming from INSIDE the computer!
        1. :information_source: If you ran the command in step 1 with customized basename, now you should include that basename as part of the URL to dev server, for example: [https://preprod.healdata.org/portal/dev.html](https://preprod.healdata.org/portal/dev.html)
    4. Now, go back to your terminal and hit Ctrl+C to cancel your local portal. This should stop the `runWebpack.sh` job that's been running. We'll start it again soon.

7. Now, if you edit the `uc-cdis/cdis-manifest/preprod.healdata.org/portal/gitops.json` file and save it, and then go back and run step 6 again, **your local copy of portal will run with the edited version of the gitops.json file**. So if you e.g. tweak the Discovery page config in your local version of gitops.json and then **restart** your local portal using step 6, you'll see your changes when you go to https://preprod.healdata.org/dev.html.
    1. If you see an error like this when you try to start your local portal again, this means that another local portal is still running! Make sure you cancel (Ctrl+C) any other `HOSTNAME=preprod.healdata.org NODE_ENV=auto bash ./runWebpack.sh` jobs that are still running.

    ```
    ✖ ｢wds｣:  Error: listen EADDRINUSE: address already in use 127.0.0.1:9443
        at Server.setupListenHandle [as _listen2] (net.js:1318:16)
        at listenInCluster (net.js:1366:12)
        at GetAddrInfoReqWrap.doListen [as callback] (net.js:1503:7)
        at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:69:8) {
      code: 'EADDRINUSE',
      errno: -48,
      syscall: 'listen',
      address: '127.0.0.1',
      port: 9443
    }
    ```

    1. Terminal pro tip: You can cycle through previous terminal commands with the up arrow key, or search through your terminal history with Ctrl+R (on mac/linux).
