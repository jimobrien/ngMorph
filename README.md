# ngMorph #
 
## Morphable Elements ##
This module is an attempt at packaging transitions/animations into directives that enable the reuse of visual elements by morphing them into other elements:

![ngMorph Demo](http://imgur.com/MT9CwbV.gif)

## Getting Started ##
  1. Install with bower:
 
    ```sh
      bower install --save angular-morph
    ```

  2. Include the module in your project: 
  
      ```js
        angular.module('yourApp', ['ngMorph']);
      ```
  3. Start morphin!
  

      ```html
        <button ng-morph-modal="settings"> Log In </button>
        <!-- coming soon:
         <div ng-morph-overlay> </div>
         <div ng-morph-expand> </div> 
         -->
         
      ```
      
      ```js
        app.controller('AppCtrl', function ($scope) {
          $scope.settings = {
            closeEl: '.close',
            template: {
              url: 'path/to/view.html'
            }
          }
        });
      ```

## What's Next ##

There is a lot of work to do before this is ready for an alpha release. Following is a list of todos to get this repo in shape:

  - [X] Abstract functionality from the post-linking function of the `morphable` directive.
  - [X] ~~Refactor using ngAnimate and GSAP~~ (sticking with CSS transitions)
  - [ ] Add support for nested morphables (morphables within view templates)
  - [ ] Add different transitions (modal, screen overlay, expand (left, right, down, up))
  - [ ] Write tests
  - [ ] Write docs
