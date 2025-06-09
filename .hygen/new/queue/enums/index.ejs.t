---
to: "src/queue/<%= h.queueFolderName(queueName) %>/enums/index.ts"
unless_exists: true
---
<%
  queueJobNamesEnumFileName = h.queueJobNamesEnumFileName(queueName)

%>export * from './<%= queueJobNamesEnumFileName %>';
