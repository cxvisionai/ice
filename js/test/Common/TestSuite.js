// **********************************************************************
//
// Copyright (c) 2003-2018 ZeroC, Inc. All rights reserved.
//
// This copy of Ice is licensed to you under the terms described in the
// ICE_LICENSE file included in this distribution.
//
// **********************************************************************

/* eslint-env jquery, browser */
/* global URI, current, TestSuites, runTest */

$(document).foundation();
$(document).ready(() =>
    {
        const es5 = document.location.pathname.indexOf("/es5/") !== -1;
        let worker;

        $("#console").height(120);

        class Output
        {
            static write(msg)
            {
                const text = $("#console").val();
                $("#console").val(text + msg);
            }

            static writeLine(msg)
            {
                Output.write(msg + "\n");
                $("#console").scrollTop($("#console").get(0).scrollHeight);
            }
        }

        const query = new URI(document.location.href).search(true);

        $("#language").val(query.language !== undefined ? query.language : "cpp");
        $("#protocol").val(document.location.protocol == "http:" ? "ws" : "wss");
        $("#test").val("/test/" + current + "/index.html");
        $("#worker").prop("checked", query.worker == "true");
        $("#loop").prop("checked", query.loop == "true");

        function nextTest()
        {
            let path = $("#test").val();
            if(document.location.pathname.indexOf("/es5/") !== -1 && path.indexOf("/es5/") === -1)
            {
                path = path.replace("/test/", "/test/es5/");
            }

            document.location.assign(
                new URI()
                    .host(document.location.host)
                    .pathname(path)
                    .search(
                        {
                            language: $("#language").val(),
                            worker: $("#worker").is(":checked"),
                            loop: $("#loop").is(":checked"),
                            next: "true"
                        }).toString());
        }

        function next(success)
        {
            if($("#loop").is(":checked"))
            {
                if(success)
                {
                    nextTest(success);
                }
            }
            else if(query.loop == "true")
            {
                updateLocation();
            }
        }

        function setRunning(running)
        {
            if(running)
            {
                $("#console").val("");
                $("#run").addClass("disabled");
                $("#test").prop("disabled", "disabled");
                $("#protocol").prop("disabled", "disabled");
                $("#language").prop("disabled", "disabled");
                $("#worker").prop("disabled", "disabled");
            }
            else
            {
                $("#test").prop("disabled", false);
                $("#protocol").prop("disabled", false);
                $("#language").prop("disabled", false);
                $("#worker").prop("disabled", false);
                $("#run").removeClass("disabled");
            }
        }

        function updateLocation()
        {
            let path = $("#test").val();
            if(document.location.pathname.indexOf("/es5/") !== -1 && path.indexOf("/es5/") === -1)
            {
                path = path.replace("/test/", "/test/es5/");
            }

            document.location.assign(
                new URI()
                    .host(document.location.host)
                    .pathname(path).search(
                        {
                            language: $("#language").val(),
                            worker: $("#worker").is(":checked"),
                            loop: $("#loop").is(":checked")
                        }).toString());
        }

        $("#run").click(e =>
                        {
                            if(!$(e.currentTarget).hasClass("disabled"))
                            {
                                setRunning(true);
                                if($("#worker").is(":checked"))
                                {
                                    worker = new Worker(es5 ? "/test/es5/Common/Worker.js" : "/test/Common/Worker.js");
                                    worker.onmessage = function(e)
                                    {
                                        if(e.data.type == "Write")
                                        {
                                            Output.write(e.data.message);
                                        }
                                        else if(e.data.type == "WriteLine")
                                        {
                                            Output.writeLine(e.data.message);
                                        }
                                        else if(e.data.type == "TestFinished")
                                        {
                                            worker.terminate();
                                            setRunning(false);
                                            next(e.data.success);
                                        }
                                    };

                                    worker.postMessage(
                                        {
                                            type: "RunTest",
                                            test:
                                            {
                                                name: current,
                                                language: $("#language").val(),
                                                defaultHost: document.location.hostname || "127.0.0.1",
                                                protocol: $("#protocol").val(),
                                                testcases: TestSuites[current].testcases,
                                                files: TestSuites[current].files,
                                                es5: document.location.pathname.indexOf("/es5/") !== -1
                                            }
                                        });

                                    worker.onerror = function(e)
                                    {
                                        console.log(e);
                                    };
                                }
                                else
                                {
                                    (async function()
                                     {
                                         let success;
                                         try
                                         {
                                             success = await runTest(current,
                                                                     $("#language").val(),
                                                                     document.location.hostname || "127.0.0.1",
                                                                     $("#protocol").val(),
                                                                     TestSuites[current].testcases,
                                                                     Output);
                                         }
                                         finally
                                         {
                                             setRunning(false);
                                         }
                                         next(success);
                                     }());
                                }
                            }
                            return false;
                        });

        $("#test").on("change", e =>
                      {
                          updateLocation();
                          return false;
                      });

        $("#language").on("change", e =>
                          {
                              updateLocation();
                              return false;
                          });

        $("#worker").on("change", e =>
                        {
                            updateLocation();
                            return false;
                        });

        $("#protocol").on("change", e =>
                          {
                              const protocol = $(e.currentTarget).val();
                              console.log(`protocol change: ${protocol}`);
                              if((document.location.protocol == "http:" && protocol == "wss") ||
                                 (document.location.protocol == "https:" && protocol == "ws"))
                              {
                                  document.location.assign(
                                      new URI()
                                          .protocol(protocol == "ws" ? "http" : "https")
                                          .hostname(document.location.hostname)
                                          .port(protocol == "ws" ? 8080 : 9090)
                                          .search(
                                              {
                                                  language: $("#language").val(),
                                                  worker: $("#worker").is(":checked")
                                              }));
                                  return false;
                              }
                          });

        if($("#loop").is(":checked"))
        {
            $("#loop").prop("checked", true);
            $("#run").click();
        }
    });
