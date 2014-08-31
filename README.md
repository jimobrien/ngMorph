# ngMorph #
 
## Morphable Elements ##
This module is an attempt at packaging transitions/animations into directives that enable the reuse of visual elements by morphing them into other elements. Simply create an originating element and an end-state view, and ngMorph takes care of the rest!

![ngMorph Demo](http://imgur.com/MT9CwbV.gif)

## Demo ##
Preview available [here](http://jimobrien.github.io/ngMorph/)

## Getting Started ##
  1. Install with bower:
 
    ```sh
      bower install --save angular-morph
    ```

  2. Include the module in your project: 
  
      ```js
        angular.module('yourApp', ['ngMorph']);
      ```

## Usage ##


###Modal###

 ```html
   <button ng-morph-modal="settings"> Log In </button>
 ```
 
 ```js
   app.controller('AppCtrl', function ($scope) {
     $scope.settings = {
       closeEl: '.close',
       modal: {
         url: 'path/to/view.html', // path to the view html
         position: { // optional positioning. default is centered.
          top: '30%',
          left: '20%'
         }
       }
     }
   });
 ```
 


###Overlay (Coming Soon)###

 ```html
   <div ng-morph-overlay="settings"> ... </div>
 ```
 
 ```js
   app.controller('AppCtrl', function ($scope) {
     $scope.settings = {
       closeEl: '.close',
       overlay: {
         url: 'path/to/view.html'
       }
     }
   });
 ```
 
 
 
###Expand (Coming Soon)###
 
 ```html
   <div ng-morph-expand="settings"> ... </div>
 ```
 
 ```js
   app.controller('AppCtrl', function ($scope) {
     $scope.settings = {
       closeEl: '.close',
       expand: {
         url: 'path/to/view.html'
       }
     }
   });
 ```



## What's Next ##

There is a lot of work to do before this is ready for an alpha release.. Following is a list of todos to get this repo in shape:

  - [X] Abstract functionality from the post-linking function of the `morphable` directive.
  - [X] ~~Refactor using ngAnimate and GSAP~~ (sticking with CSS transitions)
  - [ ] Add support for nested morphables (morphables within view templates)
  - [ ] Add different transitions (modal, screen overlay, expand (left, right, down, up))
  - [ ] Add before/after animation hooks.. (or broadcast events?)
  - [ ] Validate input settings
  - [ ] Add error handling
  - [ ] Write tests
  - [ ] Write docs
  - [ ] convert these items to GH issues
