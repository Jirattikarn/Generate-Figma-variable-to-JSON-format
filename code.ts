figma.showUI(__html__, { width: 600, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "preview") {
    let result = await runPlugin();
    console.log(result);
    // thanks this: https://egghead.io/lessons/javascript-communicate-between-the-plugin-and-figma
    figma.ui.postMessage({ type: "preview", result });
  }

  // figma.closePlugin();
};

const convertToJSON = (spiltByComma: string[]) => {
  let result: any = {};
  for (let item of spiltByComma) {
    let splitByEqual: string[] = item.split("=");
    result[splitByEqual[0]] = splitByEqual[1];
  }

  return result;
};

const runPlugin = async () => {
  let result: any[] = [];
  figma.currentPage.findAll((node) => {
    if (node.type === "TEXT" && node.name.startsWith("key=")) {
      let spiltByComma = node?.name?.split(",");
      result = [...result, convertToJSON(spiltByComma)];
    }
    return false;
  });
  return result;
};

runPlugin();
