import { Config } from "@remotion/cli/config";
Config.setEntryPoint("./src/index.js");
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva420p");
Config.setCodec("vp9");
Config.setOutputLocation("out");
