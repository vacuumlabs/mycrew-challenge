//
//  RNAlertView.m
//  RNAlertView
//
//  Created by Karan Thakkar on 12/04/17.
//  Copyright © 2017 Crowdfire Inc. All rights reserved.
//

#import "RNTAlert.h"
#import <React/RCTConvert.h>

@implementation RNTAlert

// This RCT (React) "macro" exposes the current module to JavaScript
RCT_EXPORT_MODULE();

// We must explicitly expose methods otherwise JavaScript can't access anything
RCT_EXPORT_METHOD(showAlert)
{
  
  UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"Logout alert"
                                                                 message:@"You have been logged out"
                                                          preferredStyle:UIAlertControllerStyleAlert];
  
  UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                                        handler:^(UIAlertAction * action) {}];
  
  [alert addAction:defaultAction];
  
  // parts 'borrowed' from https://github.com/Codigami/react-native-alert-view
  UIViewController *rootViewController = [self topViewControllerWithRootViewController:[[[UIApplication sharedApplication] delegate] window].rootViewController];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [rootViewController presentViewController:alert animated:YES completion:nil];
  });
}

- (UIViewController *)topViewControllerWithRootViewController:(UIViewController*)rootViewController {
  if ([rootViewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController* tabBarController = (UITabBarController*)rootViewController;
    return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
  } else if ([rootViewController isKindOfClass:[UINavigationController class]]) {
    UINavigationController* navigationController = (UINavigationController*)rootViewController;
    return [self topViewControllerWithRootViewController:navigationController.visibleViewController];
  } else if (rootViewController.presentedViewController) {
    UIViewController* presentedViewController = rootViewController.presentedViewController;
    return [self topViewControllerWithRootViewController:presentedViewController];
  } else {
    return rootViewController;
  }
}

@end
