# slim-fit
Slim, opinionated WebComponent wrapper


## How to use

```typescript
import {SlimFit} from "slim-fit";

class MyComponent extends SlimFit {
    protected render() {
        // you may pass an HTMLElement or Node or Fragment for the first parameter, too
        this.draw('<strong>Hi!</strong>', 'strong { color: red; }');
    }
}

// register HTML-Tag-Name
MyComponent.registerTag('my-component');

```
