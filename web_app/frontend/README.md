# Front End 

The front end for the UPE is built with React.js. It contains its own set of packages that must be installed separate from the rest of the web_app. To install the packages, run the following from this directory:

```bash
npm install
```

To view the frontend quickly, run the following in the directory:
```bash
npm start
```
This will start up a development environment that can be used to preview the entirety of the project. It will do so by opening your web browser to `localhost:3000`.

To create an optimized version ready for deployment, run the following
```bash
npm build
```
This creates a complete package that can be easily served with another hosting option.