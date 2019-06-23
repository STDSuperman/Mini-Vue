# Mini Vue
## 编写一个自己的vue框架
### 和Vue来一场更亲密的接触吧
![]:data:image/png;base64,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
