import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

function extractTextContent(html) {
  const $ = cheerio.load(html);

  $("script").remove();
  $("style").remove();
  $("head").remove();
  $("nav").remove();
  $("footer").remove();
  $("iframe").remove();
  $("noscript").remove();

  const body = $("body");
  if (body.length === 0) {
    return $("html").text();
  }

  return body.text();
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
}

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveUrl(baseUrl, relativeUrl) {
  if (
    !baseUrl ||
    !relativeUrl ||
    baseUrl === undefined ||
    relativeUrl === undefined
  ) {
    return null;
  }
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return null;
  }
}

async function scrapePage(
  url,
  visited = new Set(),
  pages = [],
  maxDepth = 0,
  currentDepth = 0
) {
  if (
    !url ||
    url === undefined ||
    typeof url !== "string" ||
    url.trim() === ""
  ) {
    return null;
  }

  if (url.toLowerCase().includes("undefined")) {
    return null;
  }

  if (currentDepth > maxDepth || visited.has(url)) {
    return null;
  }

  if (!isValidUrl(url)) {
    return null;
  }

  visited.add(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    $("script").remove();
    $("style").remove();
    $("head").remove();
    $("nav").remove();
    $("footer").remove();
    $("iframe").remove();
    $("noscript").remove();

    const body = $("body");
    let text = body.length > 0 ? body.text() : $("html").text();
    text = cleanText(text);

    if (text && text.trim().length > 0) {
      pages.push({
        url: url,
        content: text.trim(),
      });
    }

    if (currentDepth < maxDepth) {
      const links = [];
      $("a[href]").each((_, element) => {
        const href = $(element).attr("href");
        if (href && href !== undefined && typeof href === "string") {
          const absoluteUrl = resolveUrl(url, href);
          if (
            absoluteUrl &&
            absoluteUrl !== undefined &&
            isValidUrl(absoluteUrl)
          ) {
            const baseDomain = new URL(url).hostname;
            const linkDomain = new URL(absoluteUrl).hostname;
            if (linkDomain === baseDomain) {
              links.push(absoluteUrl);
            }
          }
        }
      });

      const uniqueLinks = [...new Set(links)].slice(0, 10);

      for (const link of uniqueLinks) {
        if (
          link &&
          link !== undefined &&
          typeof link === "string" &&
          !link.toLowerCase().includes("undefined") &&
          !visited.has(link)
        ) {
          await scrapePage(link, visited, pages, maxDepth, currentDepth + 1);
        }
      }
    }

    return pages;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { url, depth = 0 } = await request.json();

    if (
      !url ||
      url === undefined ||
      typeof url !== "string" ||
      url.trim() === "" ||
      !isValidUrl(url)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid or undefined URL provided" },
        { status: 400 }
      );
    }

    if (url.toLowerCase().includes("undefined")) {
      return NextResponse.json(
        {
          success: false,
          error: "URL contains 'undefined' and cannot be scraped",
        },
        { status: 400 }
      );
    }

    const maxDepth = Math.max(0, Math.min(parseInt(depth) || 0, 3));
    const visited = new Set();
    const pages = [];
    await scrapePage(url, visited, pages, maxDepth, 0);

    if (!pages || pages.length === 0) {
      return NextResponse.json(
        { success: false, error: "No content found or failed to scrape" },
        { status: 404 }
      );
    }

    const combinedContent = pages.map((page) => page.content).join("\n\n");

    return NextResponse.json({
      success: true,
      content: combinedContent,
      pages: pages,
      pagesScraped: pages.length,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scrape website" },
      { status: 500 }
    );
  }
}
