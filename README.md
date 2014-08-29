# ngMorph #
 
## Morphable Elements ##
This directive is an attempt at packaging necessary transitions and properties that enable the reuse of visual elements through morphing.


## How to Get Started ##

  1. Include the module in your project: 
    ```
        angular.module('yourApp', ['ngMorph']);
    ```
  2. Start morphin'
    ```js
        app.controller('AppCtrl', function ($scope) {
          $scope.morphSettings = {
            closeEl: '.close',
            template: {
              url: 'path/to/view.html'
            }
          }
        });
    ```
    ```html
      <button morphable="morphSettings"> Log In </button>
    ```
       or

    ```js
        app.controller('AppCtrl', function ($scope) {
          $scope.theView = '<div> <h1> I r view! </h1> </div>'
        });
    ```
    ```html
      <button morphable template="theView"> Log In </button>
    ```

## Roadmap ##

This files in their current state are the results of a 48hr hackathon. Needless to say, there is a lot of work to do before this is ready for an alpha release. Following is a list of todo's to get this repo in shape:

  1. Abstract functionality from the post-linking function of the `morphable` directive.
  ~~2. Refactor using ngAnimate and GSAP~~ (sticking with CSS transitions)
  2. Add support for nested morphables (morphables within view templates)
  3. Add different transitions (modal, screen overlay, expand (left, right, down, up))
