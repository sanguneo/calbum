import React from 'react-native';

const Image2merge = React.NativeModules.Image2merge;

export default {
  image2merge: (twoParts, imgName, id, callback) => {
    return Image2merge.image2merge(twoParts, imgName, id, callback);
  },
};
