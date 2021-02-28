import React, { useState, useEffect } from 'react';
import { getAll } from '../action/table';
import { getRemotePlugin } from '../action/plugin';
import Install from './install';
import Uninstall from './uninstall';
import './index.less';

export default function(){
  const [ plugins, setPlugins ] = useState([]);

  useEffect(() => {
    getAll('plugin').then(locals => {
      setPlugins(locals);
      getRemotePlugin().then(remotes => {
        (remotes.data || []).forEach(function(remote){
          if(locals[remote.name]){
            locals[remote.name] = Object.assign(remote, {
              version: locals[remote.name].version,
              newVersion: locals[remote.name].version != remote.version ? remote.version : '',
            });
          } else {
            locals[remote.name] = Object.assign(remote, {remote: true}); 
          }
        });
        setPlugins(Object.assign({}, locals));
      });
    });
  }, []);

  const installed = [];
  const recommend = [];
  Object.keys(plugins).forEach(function(name){
    const item = plugins[name];
    if(item.remote){
      recommend.push(item);
    } else {
      if(item.type === 'core'){
        installed.unshift(item);
      } else {
        installed.push(item);
      }
    }
  });

  return (
    <>
      {[{
        name: api.i18n.getMessage('installed'),
        data: installed,
      }, {
        name: api.i18n.getMessage('recommend'),
        data: recommend,
      }].map(list => {
        if(list.data.length <= 0){
          return null;
        }
        return (
          <div
            key={list.name}
            className="option-plugin"
          >
            <h3 className="option-title">{list.name}</h3>
            <div className="option-list">
              {list.data.map(plugin => {
                const { url, name, type, desc, version, newVersion, remote } = plugin;
                return (
                  <div
                    key={name}
                    className="option-item"
                  >
                    <p className="option-line">
                      <a target="_blank" href={url}>{name}</a>
                      <span className="plugin-version">{version}</span>
                    </p>
                    <p className="option-line option-desc">{desc}</p>
                    <div className="option-buttons">
                      {!remote && newVersion && (
                        <Install
                          update
                          api={api}
                          plugin={plugin}
                          onSuccess={() => {
                            plugins[name].newVersion = '';
                            plugins[name].version = newVersion;
                            setPlugins(Object.assign({}, plugins));
                          }}
                        />
                      )}
                      {!remote ? (
                        <Uninstall
                          api={api}
                          name={name}
                          disabled={type === 'core'}
                          onSuccess={() => {
                            plugins[name].remote = true;
                            setPlugins(Object.assign({}, plugins));
                          }}
                        />
                      ) : (
                        <Install
                          api={api}
                          plugin={plugin}
                          onSuccess={() => {
                            plugins[name].remote = false;
                            setPlugins(Object.assign({}, plugins));
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
