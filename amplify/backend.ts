import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { Stack, NestedStack } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

try {
  const dataStack = Stack.of(backend.data);

  // Get the amplify data stack
  const amplifyDataStack = dataStack.node.children.find((child) =>
    child.node.id.includes("amplifyData")
  );

  if (!amplifyDataStack) {
    throw new Error("Amplify data stack not found");
  }

  // Get the connection stack from the amplify data stack
  const connectionStack = amplifyDataStack.node.children.find((child) =>
    child.node.id.includes("ConnectionStack")
  );

  if (!connectionStack) {
    throw new Error("Connection stack not found");
  }

  const resourceCount = connectionStack.node.children.length;
  if (resourceCount > 500) {
    console.log("All Resources Count:", resourceCount);

    const nestedStacksCount = Math.ceil(resourceCount / 200);
    console.log("Splitting into Nested Stacks Count:", nestedStacksCount);

    const newNestedStack = new NestedStack(
      amplifyDataStack,
      "NestedSplitStack"
    );
    console.log("New Nested Stack Created:", newNestedStack.node.id);

    for (let i = 0; i < nestedStacksCount; i++) {
      const nestedStack = new NestedStack(
        newNestedStack,
        `ConnectionStackSplit${i}`
      );
      console.log(`Nested Stack ${i} Created:`, nestedStack.node.id);

      const startIndex = i * 200;
      const endIndex = Math.min(startIndex + 200, resourceCount);

      // Add the resources to the nested stack
      connectionStack.node.children
        .slice(startIndex, endIndex)
        .forEach((child) => {
          const nodeChild = new NestedStack(nestedStack, child.node.id);
          // console.log(nodeChild.nestedStackResource.);
          child.node.metadata.forEach((metadata) => {
            nodeChild.node.addMetadata(metadata.type, metadata.data);
          });
          nodeChild.node.addDependency(child);
        });

      console.log(
        `Nested Stack ${i} Resources Count: ${startIndex} - ${endIndex}`
      );
      newNestedStack.node.addDependency(nestedStack);
      console.log(
        `Nested Stack ${i} Total Resources:`,
        nestedStack.node.children.length
      );
    }

    // Remove resources from the original connection stack
    connectionStack.node.children.forEach((child) => {
      //connectionStack.node.tryRemoveChild(child.node.id);
    });
  }
} catch (error) {
  console.error("Error splitting stacks:", error);
  throw new Error("Error splitting stacks. Error: " + error);
}
