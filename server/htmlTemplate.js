class HtmlTemplate {
  constructor({
    html,
    adBoilerplate,
    preloadedState,
    analytics,
    appEnvVars,
    bundle,
    headTags,
    googleAnalytics,
    loadingScript,
    schemaScript,
    optimizelyScript,
    parselyScript,
    emotionTag,
    globalStylesTag
  }) {
    this.html = html || "";
    this.emotionTag = emotionTag || "";
    this.globalStylesTag = globalStylesTag || "";
    this.adBoilerplate = adBoilerplate || "";
    this.preloadedState = preloadedState || "";
    this.analytics = analytics || "";
    this.appEnvVars = appEnvVars || "";
    this.bundle = bundle || "";
    this.headTags = headTags || "";
    this.googleAnalytics = googleAnalytics || "";
    this.loadingScript = loadingScript || "";
    this.schemaScript = schemaScript || "";
    this.optimizelyScript = optimizelyScript || "";
    this.parselyScript = parselyScript || "";
  }

  beginning() {
    return `<!DOCTYPE html>
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <head>        
        ${this.bundle}
        ${this.loadingScript}
        ${this.globalStylesTag}
        ${this.emotionTag}
      </head>
      <body class="init">
        <div id="root">`;
  }

  end() {
    return `</div>        
      </body>
    </html>`;
  }

  full() {
    return `${this.beginning()}${this.html}${this.end()}`;
  }
}

export default HtmlTemplate;
