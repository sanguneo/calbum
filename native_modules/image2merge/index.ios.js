import React from 'react-native';

const Image2merge = React.NativeModules.Image2merge;

export default {
  image2merge: () => {
    return Image2merge.image2merge();
  },
};
