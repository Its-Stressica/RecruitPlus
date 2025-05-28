import { Pipe, PipeTransform, SecurityContext, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'truncate',
  standalone: true
})
@Injectable({
  providedIn: 'root'
})
export class TruncatePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(
    value: string | null | undefined, 
    limit: number = 250, 
    completeWords: boolean = true, 
    ellipsis: string = '...',
    showTitle: boolean = false
  ): string {
    if (!value) return '';

    try {
      // Sanitize the HTML content first
      const sanitizedContent = this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
      
      // Create a temporary element to handle HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizedContent;
      
      // Get the text content with spaces between elements
      const textContent = this.getTextContent(tempDiv);
      const plainText = textContent.replace(/\s+/g, ' ').trim();
      
      // If the text is shorter than the limit, return the original sanitized content
      if (plainText.length <= limit) {
        return sanitizedContent;
      }

      // Find the last space before the limit if completeWords is true
      let truncatedText = plainText;
      if (completeWords) {
        const lastSpaceIndex = plainText.substr(0, limit).lastIndexOf(' ');
        if (lastSpaceIndex > 0) {
          limit = lastSpaceIndex;
        }
      }
      
      // Truncate the text and add ellipsis
      truncatedText = plainText.substr(0, limit) + ellipsis;
      
      // If showTitle is true, add the full text as a title attribute
      if (showTitle) {
        return `<span title="${plainText.replace(/"/g, '&quot;')}">${truncatedText}</span>`;
      }
      
      return truncatedText;
    } catch (error) {
      console.error('Error in TruncatePipe:', error);
      return value.length > limit ? value.substring(0, limit) + ellipsis : value;
    }
  }

  /**
   * Recursively gets text content from a DOM node
   */
  private getTextContent(node: Node): string {
    let text = '';
    
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Preserve line breaks for block elements
      const element = node as HTMLElement;
      const display = window.getComputedStyle(element).display;
      const isBlock = display === 'block' || display === 'list-item' || 
                     display === 'flex' || display === 'grid';
      
      if (isBlock && text) {
        text += ' ';
      }
      
      // Process child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        text += this.getTextContent(node.childNodes[i]);
      }
      
      // Add space after block elements
      if (isBlock && text) {
        text += ' ';
      }
    }
    
    return text;
  }
}
