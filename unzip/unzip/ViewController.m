//
//  ViewController.m
//  unzip
//
//  Created by xiangwenwen on 15/10/9.
//  Copyright © 2015年 xiangwenwen. All rights reserved.
//

#import <WebViewJavascriptBridge/WebViewJavascriptBridge.h>
#import <ZipArchive/ZipArchive.h>
#import <Masonry/Masonry.h>
#import "ViewController.h"

@interface ViewController () <UIWebViewDelegate>

@property(nonatomic, strong) WebViewJavascriptBridge *bridge;
@property(nonatomic, strong) UIWebView *webview;
@property(nonatomic, copy) NSString *doc;

@end

@implementation ViewController

-(UIWebView *)webview
{
    if (!_webview) {
        _webview = [[UIWebView alloc] initWithFrame:self.view.frame];
    }
    return _webview;
}

-(WebViewJavascriptBridge *)bridge
{
    if (!_bridge) {
        _bridge = [WebViewJavascriptBridge bridgeForWebView:self.webview webViewDelegate:self handler:^(id data, WVJBResponseCallback responseCallback) {
            responseCallback(@"启动 webview bridge");
        }];
    }
    return _bridge;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.view addSubview:self.webview];
    self.doc = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
    [self readHTMLString];
    // Do any additional setup after loading the view, typically from a nib.
    [self.bridge registerHandler:@"authR...." handler:^(id data, WVJBResponseCallback responseCallback) {
        responseCallback(@"hello");
    }];
}

- (void)readHTMLString
{
    NSString *zipResource = [[NSBundle mainBundle] pathForResource:@"app-d10bd73eb129cfff6b2b13822296a9b4" ofType:@"zip"];
    ZipArchive *ze = [[ZipArchive alloc] init];
    if ([ze UnzipOpenFile:zipResource]) {
        BOOL success = [ze UnzipFileTo:self.doc overWrite:YES];
        if (success) {
            NSLog(@"解压成功 --- >");
            [ze UnzipCloseFile];
            NSString *htmlPath = [self.doc stringByAppendingPathComponent:@"index.html"];
            NSString *htmlString = [NSString stringWithContentsOfFile:htmlPath encoding:NSUTF8StringEncoding error:nil];
            NSURL *baseUrl = [NSURL URLWithString:[self.doc stringByAppendingPathComponent:@"index.html?communityId=1&discovery"]];
            [self.webview loadHTMLString:htmlString baseURL:baseUrl];
        }
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
