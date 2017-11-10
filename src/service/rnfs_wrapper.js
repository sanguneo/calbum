/**
 * Created by 나상권 on 2017-05-19.
 */
'use strict';
import {Platform} from 'react-native';

const RNFS = require('react-native-fs');
RNFS.PlatformDependPath = (Platform.OS === 'ios') ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;

module.exports = RNFS;