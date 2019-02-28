# DirectorySyncer

## Install
```
npm install
```

## RUN 

cmd

```
node sync.js
```

or run **run.bat**


## Config
```
"workingDir"             "D:/ae/working",    <-- dir with projects
"releaseDir"             "D:/ae/release",    <-- dir for store released projects
"outDirName"             "out",              <-- dirName for release files in projects workingDir
"checkIntervalSeconds"   10,                 <-- Sync run interval in SECONDS
"move"                   false               <-- mode: COPY or MOVE files
```

## Output
app output info if it need

![Example](https://raw.githubusercontent.com/s4urp8n/directorySyncer/master/img.png "Example")
