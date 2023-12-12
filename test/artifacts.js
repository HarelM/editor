import path from "path";
import mkdirp from "mkdirp";


function genPath(subPath) {
  subPath = subPath || ".";
  var buildPath;

  if(process.env.CIRCLECI) {
    buildPath = path.join("/tmp/artifacts", subPath);
  }
  else {
    buildPath = path.join(__dirname, '..', 'build', subPath);
  }

  return buildPath;
}

export const path = function(subPath) {
  var dirPath = genPath(subPath);

  return new Promise(function(resolve, reject) {
    mkdirp(dirPath, function(err) {
      if(err) {
        reject(err);
      }
      else {
        resolve(dirPath);
      }
    });
  });
};

export const pathSync = function(subPath) {
  var dirPath = genPath(subPath);
  mkdirp.sync(dirPath);
  return dirPath;
};

