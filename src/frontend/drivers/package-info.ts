import xs, { Stream } from "xstream";
import RNAndroidPM, { PackageInfo } from "react-native-android-packagemanager";

export type InfoReq = {
  datHash: string;
  path: string;
};

export type InfoRes = {
  datHash: string;
  info: PackageInfo;
};

export default function packageInfoDriver(
  sink: Stream<InfoReq>,
): Stream<InfoRes> {
  const source = sink
    .map(req =>
      xs
        .fromPromise(RNAndroidPM.getPackageInfo(req.path))
        .map(info => ({ datHash: req.datHash, info })),
    )
    .flatten()
    .remember();

  source.addListener({
    error: e => {
      console.error(e);
    },
  });

  return source;
}
