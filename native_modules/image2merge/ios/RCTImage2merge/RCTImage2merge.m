#import "RCTImage2merge.h"

@implementation Image2merge

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(image2merge,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@"Hello World!");
}

@end
