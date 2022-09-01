figma.showUI(__html__, { width: 600, height: 500 });

figma.skipInvisibleInstanceChildren = true;

figma.ui.onmessage = async (msg) => {
  if (msg.type === "preview") {
    let result = await runPlugin();
    console.log(result);
    // thanks this: https://egghead.io/lessons/javascript-communicate-between-the-plugin-and-figma
    figma.ui.postMessage({ type: "preview", result });
  }

  // figma.closePlugin();
};

const convertToJSON = (spiltByComma: string[], text: string) => {
  let result: any = {};
  for (let item of spiltByComma) {
    let splitByEqual: string[] = item.split("=");
    if (!splitByEqual[1]) {
      result[splitByEqual[0]] = text.replace(/\n/, "");
    } else {
      result[splitByEqual[0]] = splitByEqual[1];
    }
  }

  return result;
};

const runPlugin = async () => {
  let result: any[] = [];

  figma.currentPage.findChildren((nodeParent: SceneNode) => {
    if (nodeParent.type === "FRAME" && nodeParent.visible) {
      let nodes = nodeParent.findAllWithCriteria({
        types: ["TEXT"],
      });

      for (let node of nodes) {
        let text = node.characters;
        if (node.name.startsWith("key=") && node.visible) {
          let spiltByComma = node?.name?.split(",");
          result = [...result, convertToJSON(spiltByComma as string[], text)];
        }
      }
    }
    return false;
  });

  return result;
};
