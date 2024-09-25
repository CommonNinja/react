import React, { CSSProperties, useEffect, useState } from "react";

interface ICommonNinjaWidgetProps {
  widgetId: string;
  type?: string;
  widgetProps?: string;
  muteEvents?: boolean;
  onLoad?: () => void;
  loader?: React.ReactNode;
  style?: CSSProperties;
}

declare global {
  interface Window {
    CommonNinja: any;
  }
}

let loadedWidgetId: string = "";

export const CommonNinjaWidget = (props: ICommonNinjaWidgetProps) => {
  const {
    widgetId,
    onLoad,
    loader = <></>,
    muteEvents,
    style,
    widgetProps,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(
    typeof document !== "undefined" &&
      !!document?.getElementById("commonninja-sdk")
  );
  const conditionalProps: any = {};

  if (muteEvents) {
    conditionalProps["mute-events"] = true;
  }

  if (widgetProps) {
    conditionalProps["comp-props"] = widgetProps;
  }

  function init() {
    loadedWidgetId = widgetId;

    if (
      typeof window !== "undefined" &&
      typeof window.CommonNinja !== "undefined"
    ) {
      window.CommonNinja.init(() => {
        setLoading(false);
      });
    }
  }

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const existingScript = document?.getElementById("commonninja-sdk");

    if (!existingScript) {
      const script = document?.createElement("script");
      script.src = "https://cdn.commoninja.com/sdk/latest/commonninja.js";
      script.id = "commonninja-sdk";
      document?.body.appendChild(script);
      script.onload = () => {
        setScriptLoaded(true);
      };
    }
  });

  useEffect(() => {
    if (widgetId !== loadedWidgetId) {
      init();
    }
  }, [widgetId]);

  useEffect(() => {
    if (scriptLoaded) {
      init();
      onLoad?.();
    }
  }, [scriptLoaded]);

  return (
    <>
      {loading && loader}
      <div
        className={`commonninja_component pid-${widgetId}`}
        style={style}
        {...conditionalProps}
      ></div>
    </>
  );
};

export const CommonNinjaPlugin = CommonNinjaWidget;