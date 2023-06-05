"use client";
import ExtensionRouse from "src/pages-components/extension-rouse";
import { ExtensionRouseParams } from "src/types";

export default function Page({
  searchParams,
}: {
  searchParams: ExtensionRouseParams;
}) {
  return <div>{<ExtensionRouse params={searchParams} />}</div>;
}
